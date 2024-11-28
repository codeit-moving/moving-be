import { int } from "aws-sdk/clients/datapipeline";
import prismaClient from "../utils/prismaClient";

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
}

interface RatingResult {
  totalCount: number;
  totalSum: number;
  average?: number;
  [key: string]: number | undefined;
}

const getMoverCount = async (where: whereConditions) => {
  return prismaClient.mover.count({ where });
};

//기사 목록 조회
const getMoverList = (
  orderBy: { [key: string]: object | string },
  where: whereConditions,
  cursor: int
) => {
  return prismaClient.mover.findMany({
    orderBy,
    where,
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      imageUrl: true,
      nickname: true,
      career: true,
      introduction: true,
      description: true,
      services: true,
      regions: true,
      _count: {
        select: {
          review: true,
          favorite: true,
          confirmedQuote: true,
        },
      },
    },
  });
};

//기사 상세 조회
const getMoverById = (customerId: number | null, moverId: number) => {
  const baseSelect = {
    id: true,
    imageUrl: true,
    services: true,
    nickname: true,
    career: true,
    regions: true,
    introduction: true,
    _count: {
      select: {
        review: true,
        favorite: true,
        confirmedQuote: true,
      },
    },
  };

  return prismaClient.mover.findUnique({
    where: { id: moverId },
    select: {
      ...baseSelect,
      ...(customerId
        ? {
            favorite: {
              where: {
                id: customerId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
  });
};

//기사 평점 조회
const getRatingsByMoverIds = async (moverIds: number | number[]) => {
  // 단일 ID를 배열로 변환
  const moverIdArray = Array.isArray(moverIds) ? moverIds : [moverIds];

  const ratings = await prismaClient.review.groupBy({
    where: {
      moverId: {
        in: moverIdArray,
      },
    },
    by: ["moverId", "rating"],
    _count: {
      rating: true,
    },
  });

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
  getMoverCount,
  getMoverList,
  getRatingsByMoverIds,
  getMoverById,
};
