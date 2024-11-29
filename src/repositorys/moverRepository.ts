import prismaClient from "../utils/prismaClient";

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
}

const getMoverCount = async (where: whereConditions) => {
  return prismaClient.mover.count({ where });
};

//기사 목록 조회
const getMoverList = (
  orderBy: { [key: string]: object | string },
  where: whereConditions,
  cursor: number,
  limit: number
) => {
  return prismaClient.mover.findMany({
    orderBy,
    where,
    take: limit,
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
      movingRequest: {
        select: {
          id: true,
        },
      },
      favorite: {
        select: {
          id: true,
        },
      },
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
    movingRequest: true,
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

//기사 평점 그룹화
const getRatingsByMoverIds = async (moverIds: number[]) => {
  const ratings = await prismaClient.review.groupBy({
    where: {
      moverId: {
        in: moverIds,
      },
    },
    by: ["moverId", "rating"],
    _count: {
      rating: true,
    },
  });

  return ratings;
};

const toggleFavorite = async (moverId: number, favorite: object) => {
  return prismaClient.mover.update({
    where: { id: moverId },
    data: { favorite },
    select: {
      id: true,
    },
  });
};

export default {
  getMoverCount,
  getMoverList,
  getRatingsByMoverIds,
  getMoverById,
  toggleFavorite,
};
