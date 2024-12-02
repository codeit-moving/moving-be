import { Request } from "express";
import moverRepository from "../repositorys/moverRepository";
import CustomError from "../utils/interfaces/customError";
import processMoversData from "../utils/mover/processMoverData";
import RatingResult from "../utils/interfaces/mover/ratingResult";

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
  customer?: object;
}

interface FavoriteData {
  connect?: object;
  disconnect?: object;
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
    whereConditions.customer = { has: customerId };
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

  return processMover;
};

//찜 토글
const toggleFavorite = async (
  customerId: number,
  moverId: number,
  favorite: boolean
) => {
  const favoriteData: FavoriteData = {};
  if (favorite) {
    favoriteData.connect = {
      id: customerId,
    };
  } else {
    favoriteData.disconnect = {
      id: customerId,
    };
  }

  const mover = await moverRepository.toggleFavorite(moverId, favoriteData);
  if (!mover) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "기사 정보를 찾을 수 없습니다.",
    };
    throw error;
  }

  return { ...mover, isFavorite: favorite };
};

//평점 조회
const getRatingsByMoverIds = async (moverIds: number | number[]) => {
  const moverIdArray = Array.isArray(moverIds) ? moverIds : [moverIds];

  const ratings = await moverRepository.getRatingsByMoverIds(moverIdArray);

  // moverId별로 그룹화
  const ratingsByMover = moverIdArray.reduce((acc, moverId) => {
    acc[moverId] = {
      totalCount: 0,
      totalSum: 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      average: 0,
    };
    return acc;
  }, {} as Record<number, RatingResult>);

  // 각 rating 데이터 처리
  ratings.forEach((rating) => {
    const moverRating = ratingsByMover[rating.moverId];
    moverRating.totalCount += rating._count.rating;
    moverRating.totalSum += rating.rating * rating._count.rating;
    moverRating[`${rating.rating}`] = rating._count.rating;
  });

  // 평균 계산 및 totalSum 제거
  Object.values(ratingsByMover).forEach((rating) => {
    rating.average =
      Math.round((rating.totalSum / rating.totalCount) * 10) / 10;
    const { totalSum, ...returnResult } = rating;
    return returnResult;
  });

  return ratingsByMover;
};

export default {
  getMoverList,
  getMoverDetail,
  toggleFavorite,
};
