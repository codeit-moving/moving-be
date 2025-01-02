import { Request } from "express";
import moverRepository from "../repositorys/moverRepository";
import CustomError from "../utils/interfaces/customError";
import processMoversData from "../utils/mover/processMoverData";
import RatingResult from "../utils/interfaces/mover/ratingResult";
import imageRepository from "../repositorys/imageRepository";
import getRatingsByMoverIds from "../utils/mover/getRatingsByMover";
import { throwHttpError } from "../utils/constructors/httpError";

interface queryString {
  order: string;
  region: number;
  service: number;
  keyword: string;
  limit: number;
  cursor: number;
  isFavorite: string;
}

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
  favorite?: object;
}

interface FavoriteData {
  connect?: object;
  disconnect?: object;
}

interface UpdateProfile {
  nickname?: string;
  imageUrl?: string[];
  career?: number;
  introduction?: string;
  description?: string;
  services?: number[];
  regions?: number[];
}

interface Profile {
  userId: number;
  nickname: string;
  career: number;
  introduction: string;
  description: string;
  services: number[];
  regions: number[];
  imageUrl: string[];
}

const setOrderByOptions = (
  order: string
): { [key: string]: object | string } => {
  switch (order) {
    case "review":
      return { review: { _count: "desc" } };
    case "career":
      return { career: "desc" };
    case "confirm":
      return { confirmedQuote: { _count: "desc" } };
    default:
      return { review: { _count: "desc" } };
  }
};

//기사 목록 조회
const getMoverList = async (query: queryString, customerId: number | null) => {
  const { order, keyword, region, service, cursor, limit, isFavorite } = query;

  //정렬 옵션 설정
  const orderByOptions = setOrderByOptions(order);

  //쿼리 조건 설정
  const whereConditions: whereConditions = {};
  if (keyword) {
    whereConditions.OR = [
      { nickname: { contains: keyword, mode: "insensitive" } },
      { introduction: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }
  if (region) {
    whereConditions.regions = { has: region };
  }
  if (service) {
    whereConditions.services = { has: service };
  }
  if (isFavorite === "true" && customerId) {
    whereConditions.favorite = { some: { id: customerId } };
  }

  //데이터 조회
  const movers = await moverRepository.getMoverList(
    orderByOptions,
    whereConditions,
    cursor,
    limit
  );

  if (!movers) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "조건에 맞는 기사 목록이 없습니다.",
    };
    throw error;
  }

  //평균 평점 조회
  const moverIds = movers.map((mover) => mover.id);
  const ratingsByMover = await getRatingsByMoverIds(moverIds);

  //커서 설정
  const nextMover = movers.length > limit;
  const nextCursor = nextMover ? movers[limit - 1].id : "";
  const hasNext = Boolean(nextCursor);

  //데이터 가공
  const resMovers = await processMoversData(customerId, movers, ratingsByMover);

  //평균 평점으로 정렬
  if (order === "rating") {
    resMovers.sort(
      (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)
    );
  }

  //응답 데이터 반환
  return {
    nextCursor,
    hasNext,
    list: resMovers.slice(0, limit),
  };
};

//찜한 기사 목록 조회
const getMoverByFavorite = async (
  customerId: number,
  limit: number,
  cursor: number
) => {
  const movers = await moverRepository.getMoverByFavorite(
    customerId,
    limit,
    cursor
  );

  if (!movers.length) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "찜한 기사가 없습니다.",
    };
    throw error;
  }

  const moverIds = movers.map((mover) => mover.id);
  const ratingsByMover = await getRatingsByMoverIds(moverIds);
  const processMovers = await processMoversData(
    customerId,
    movers,
    ratingsByMover
  );

  //커서 설정
  const nextMover = movers.length > limit;
  const nextCursor = nextMover ? movers[limit - 1].id : "";
  const hasNext = Boolean(nextCursor);

  return {
    nextCursor,
    hasNext,
    list: processMovers.slice(0, limit),
  };
};

//기사 상세 조회
const getMoverDetail = async (customerId: number | null, moverId: number) => {
  const mover = await moverRepository.getMoverById(customerId, moverId);
  if (!mover) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "기사 정보를 찾을 수 없습니다.",
    };
    throw error;
  }

  //데이터 가공
  const ratingsByMover = await getRatingsByMoverIds(moverId);
  const processMover = await processMoversData(
    customerId,
    mover,
    ratingsByMover
  );

  return processMover[0];
};

//찜 토글
const moverFavorite = async (customerId: number, moverId: number) => {
  const mover = await moverRepository.moverFavorite(customerId, moverId);
  if (!mover) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "기사 정보를 찾을 수 없습니다.",
    };
    throw error;
  }

  return { ...mover, isFavorite: true };
};

const moverFavoriteCancel = async (customerId: number, moverId: number) => {
  const mover = await moverRepository.moverFavoriteCancel(customerId, moverId);
  if (!mover) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "기사 정보를 찾을 수 없습니다.",
    };
    throw error;
  }
  return { ...mover, isFavorite: false };
};

const getMover = async (moverId: number) => {
  const mover = await moverRepository.getMoverById(null, moverId);

  if (!mover) {
    const error: CustomError = new Error("NotFound");
    error.status = 404;
    error.data = {
      message: "존재하지 않는 기사입니다.",
    };
    throw error;
  }

  const ratingsByMover = await getRatingsByMoverIds(moverId);
  const processedMover = await processMoversData(null, mover, ratingsByMover);

  return processedMover[0];
};

const updateMoverProfile = async (
  userId: number,
  moverId: number,
  profile: UpdateProfile
) => {
  const { imageUrl, ...rest } = profile;
  console.log(rest);
  try {
    return await imageRepository.updateMoverProfile(
      imageUrl ? imageUrl[0] : undefined,
      userId,
      moverId,
      rest
    );
  } catch (e) {
    return throwHttpError(500, "프로필 업데이트 실패");
  }
};

const createMoverProfile = async (profile: Profile) => {
  const moverProfile = {
    ...profile,
    imageUrl: profile.imageUrl[0],
  };
  return moverRepository.createMoverProfile(moverProfile);
};

export default {
  getMoverList,
  getMoverDetail,
  moverFavorite,
  moverFavoriteCancel,
  getMoverByFavorite,
  getMover,
  updateMoverProfile,
  createMoverProfile,
};
