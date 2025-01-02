import { Request } from "express";
import moverRepository from "../repositorys/moverRepository";
import CustomError from "../utils/interfaces/customError";
import processMoversData from "../utils/mover/processMoverData";
import RatingResult from "../utils/interfaces/mover/ratingResult";
import imageRepository from "../repositorys/imageRepository";
import { uploadFile } from "../utils/s3.utils";
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

interface UpdateProfile {
  nickname?: string;
  imageUrl?: Express.Multer.File;
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
  imageUrl: Express.Multer.File;
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

  // cursor가 있을 경우 해당 id의 mover 데이터를 먼저 조회
  let cursorData: { [key: string]: any; id: number } | undefined;
  if (cursor) {
    const cursorMover = await moverRepository.getMoverById(null, cursor);
    if (cursorMover) {
      cursorData = {
        id: cursor,
        _count: cursorMover._count,
      };
    }
  }

  //데이터 조회
  const movers = await moverRepository.getMoverList(
    orderByOptions,
    whereConditions,
    cursorData || null, // 조회한 커서 데이터 전달
    limit
  );

  if (!movers) {
    return throwHttpError(404, "조건에 맞는 기사 목록이 없습니다.");
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
    return throwHttpError(404, "찜한 기사가 없습니다.");
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
    return throwHttpError(404, "기사 정보를 찾을 수 없습니다.");
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
    return throwHttpError(404, "기사 정보를 찾을 수 없습니다.");
  }

  return { ...mover, isFavorite: true };
};

//찜 취소
const moverFavoriteCancel = async (customerId: number, moverId: number) => {
  const mover = await moverRepository.moverFavoriteCancel(customerId, moverId);
  if (!mover) {
    return throwHttpError(404, "기사 정보를 찾을 수 없습니다.");
  }
  return { ...mover, isFavorite: false };
};

//기사 조회
const getMover = async (moverId: number) => {
  const mover = await moverRepository.getMoverById(null, moverId);

  if (!mover) {
    return throwHttpError(404, "존재하지 않는 기사입니다.");
  }

  const ratingsByMover = await getRatingsByMoverIds(moverId);
  const processedMover = await processMoversData(null, mover, ratingsByMover);

  return processedMover[0];
};

//기사 프로필 업데이트
const updateMoverProfile = async (
  userId: number,
  moverId: number,
  profile: UpdateProfile
) => {
  const { imageUrl, ...rest } = profile;
  let uploadedImageUrl;

  if (imageUrl) {
    try {
      uploadedImageUrl = await uploadFile(imageUrl);
    } catch (e) {
      const error: CustomError = new Error("Internal Server Error");
      error.status = 500;
      error.data = {
        message: "이미지 업로드 실패",
      };
      throw error;
    }
  }

  try {
    return await imageRepository.updateMoverProfile(
      uploadedImageUrl,
      userId,
      moverId,
      rest
    );
  } catch (e) {
    const error: CustomError = new Error("Internal Server Error");
    error.status = 500;
    error.data = {
      message: "프로필 업데이트 실패",
    };
    throw error;
  }
};

//기사 프로필 생성
const createMoverProfile = async (profile: Profile) => {
  const imageUrl = await uploadFile(profile.imageUrl);
  const moverProfile = {
    ...profile,
    imageUrl,
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
