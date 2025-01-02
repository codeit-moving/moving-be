import prismaClient from "../utils/prismaClient";

interface whereConditions {
  keyword?: string;
  regions?: object;
  services?: object;
  OR?: object[];
}

type CursorFields = "id" | "createAt";

interface UpdateProfile {
  nickname?: string;
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
  imageUrl: string;
}

const defaultSelect = {
  id: true,
  services: true,
  nickname: true,
  career: true,
  regions: true,
  introduction: true,
  description: true,
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
  cursor: { [key: string]: any; id: number } | null,
  limit: number
) => {
  const orderByKey = Object.keys(orderBy)[0] as CursorFields;

  return prismaClient.mover.findMany({
    orderBy: [orderBy, { id: "asc" }],
    where,
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          [orderByKey]: cursor[orderByKey],
          id: cursor.id,
        }
      : undefined,
    select: {
      ...defaultSelect,
      imageUrl: {
        where: {
          status: true,
        },
        orderBy: {
          createAt: "desc",
        },
        select: {
          imageUrl: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
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
      imageUrl: {
        where: {
          status: true,
        },
        orderBy: {
          createAt: "desc",
        },
        select: {
          imageUrl: true,
        },
      },
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

const moverFavorite = async (customerId: number, moverId: number) => {
  return prismaClient.mover.update({
    where: { id: moverId },
    data: { favorite: { connect: { id: customerId } } },
    select: {
      id: true,
    },
  });
};

const moverFavoriteCancel = async (customerId: number, moverId: number) => {
  return prismaClient.mover.update({
    where: { id: moverId },
    data: { favorite: { disconnect: { id: customerId } } },
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
      imageUrl: {
        where: {
          status: true,
        },
        orderBy: {
          createAt: "desc",
        },
        select: {
          imageUrl: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
      favorite: {
        select: {
          id: true,
        },
      },
    },
  });
};

const createMoverProfile = (profile: Profile) => {
  return prismaClient.mover.create({
    data: { ...profile, imageUrl: { create: { imageUrl: profile.imageUrl } } },
  });
};

export default {
  getMoverCount,
  getMoverList,
  getRatingsByMoverIds,
  getMoverById,
  moverFavorite,
  moverFavoriteCancel,
  getMoverByFavorite,
  createMoverProfile,
};
