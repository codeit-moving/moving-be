import prismaClient from "../utils/prismaClient";

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
}

const defaultSelect = {
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
    take: limit + 1,
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      ...defaultSelect,
      favorite: {
        select: {
          id: true,
        },
      },
    },
  });
};

//기사 상세 조회
const getMoverById = (customerId: number | null, moverId: number) => {
  return prismaClient.mover.findUnique({
    where: { id: moverId },
    select: {
      ...defaultSelect,
      user: {
        select: {
          name: true,
        },
      },
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

const getMoverByFavorite = (
  customerId: number,
  limit: number,
  cursor: number
) => {
  return prismaClient.mover.findMany({
    orderBy: { createAt: "desc" },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { favorite: { some: { id: customerId } } },
    select: {
      ...defaultSelect,
      favorite: {
        select: {
          id: true,
        },
      },
    },
  });
};

export default {
  getMoverCount,
  getMoverList,
  getRatingsByMoverIds,
  getMoverById,
  toggleFavorite,
  getMoverByFavorite,
};
