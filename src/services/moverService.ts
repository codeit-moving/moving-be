import { Request } from "express";
import moverRepository from "../repositorys/moverRepository";
import CustomError from "../utils/interfaces/customError";

interface queryString {
  nextCursorId: string;
  order: string;
  region: string;
  service: string;
  keyword: string;
  limit: string;
}

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
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
const getMoverList = async (req: Request) => {
  const {
    nextCursorId = "0",
    order = "",
    limit = "10",
    keyword = "",
    region = "0",
    service = "0",
  } = req.query as unknown as queryString;

  //스크링 쿼리 파싱
  const parseCursor = parseInt(nextCursorId);
  const parseRegion = parseInt(region);
  const parseService = parseInt(service);
  const parseLimit = parseInt(limit);

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
  if (parseRegion) {
    whereConditions.regions = {
      has: parseRegion,
    };
  }
  if (parseService) {
    whereConditions.services = {
      has: parseService,
    };
  }

  //데이터 조회
  const movers = await moverRepository.getMoverList(
    orderByOptions,
    whereConditions,
    parseCursor
  );

  //평균 평점 조회
  const moverIds = movers.map((mover) => mover.id);
  const ratingsByMover = await moverRepository.getRatingsByMoverIds(moverIds);

  //커서 설정
  const nextMover = movers.length > parseLimit;
  const nextCursor = nextMover ? movers[parseLimit - 1].id : "";
  const hasNext = Boolean(nextCursor);

  //데이터 가공
  const resMovers = movers.map((mover) => {
    const { _count, ...rest } = mover;
    return {
      ...rest,
      reviewCount: _count.review,
      favoriteCount: _count.favorite,
      confirmCount: _count.confirmedQuote,
      rating: ratingsByMover[mover.id],
    };
  });

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
    list: resMovers.slice(0, parseLimit),
  };
};

//기사 상세 조회
const getMoverDetail = async (req: Request) => {
  const { id: moverId } = req.params;
  const parseMoverId = parseInt(moverId);

  //나중에 토큰의 검사가 가능할때 업데이트 필요
  // const { id: customerId } = req.user as { id: number | null };

  const mover = await moverRepository.getMoverById(1, parseInt(moverId));
  if (!mover) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "기사 정보를 찾을 수 없습니다.",
    };
    throw error;
  }

  let isFavorite = false;
  if (mover.favorite && mover.favorite.length > 0) {
    isFavorite = true;
  }

  //데이터 가공
  const ratingsByMover = await moverRepository.getRatingsByMoverIds(
    parseMoverId
  );
  const { _count, favorite, ...rest } = mover;

  return {
    ...rest,
    reviewCount: _count.review,
    confirmCount: _count.confirmedQuote,
    favoriteCount: _count.favorite,
    isFavorite,
    rating: ratingsByMover[mover.id],
  };
};

export default {
  getMoverList,
  getMoverDetail,
};
