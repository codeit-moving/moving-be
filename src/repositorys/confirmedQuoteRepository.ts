import prismaClient from "../utils/prismaClient";

interface ConfirmedQuote {
  movingRequestId: number;
  quoteId: number;
  customerId: number;
  moverId: number;
}

const CreateConfirmedQuote = (confirmedQuote: ConfirmedQuote) => {
  return prismaClient.confirmedQuote.create({
    data: confirmedQuote,
    select: {
      id: true,
      movingRequest: {
        select: {
          id: true,
          service: true,
          movingDate: true,
          pickupAddress: true,
          dropOffAddress: true,
        },
      },
      quote: {
        select: {
          id: true,
          cost: true,
          comment: true,
        },
      },
      mover: {
        select: {
          id: true,
          imageUrl: true,
          services: true,
          nickname: true,
          career: true,
          regions: true,
          introduction: true,
        },
      },
      customer: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const findAllByDay = (day: Date) => {
  return prismaClient.confirmedQuote.findMany({
    where: {
      movingRequest: {
        movingDate: day,
      },
    },
    select: {
      id: true,
      movingRequest: {
        select: {
          service: true,
          movingDate: true,
          pickupAddress: true,
          dropOffAddress: true,
        },
      },
      customer: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      quote: {
        select: {
          id: true,
        },
      },
      mover: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
          nickname: true,
        },
      },
    },
  });
};

const getAvailableReviewCount = (customerId: number) => {
  return prismaClient.confirmedQuote.count({
    where: {
      customerId,
      review: {
        none: {},
      },
      movingRequest: {
        movingDate: {
          lt: new Date(),
        },
      },
    },
  });
};

const getAvailableReviewList = (
  customerId: number,
  query: { pageSize: number; pageNum: number }
) => {
  return prismaClient.confirmedQuote.findMany({
    where: {
      customerId,
      movingRequest: {
        movingDate: {
          lt: new Date(),
        },
      },
      review: {
        none: {},
      },
    },
    take: query.pageSize || 6,
    skip: (query.pageNum - 1) * (query.pageSize || 6),
    select: {
      id: true,
      movingRequest: {
        select: {
          service: true,
          movingDate: true,
          mover: {
            select: {
              id: true,
            },
          },
        },
      },
      quote: {
        select: {
          cost: true,
        },
      },
      mover: {
        select: {
          id: true,
          nickname: true,
          imageUrl: {
            orderBy: {
              createdAt: "desc",
            },
            where: {
              status: true,
            },
            select: {
              imageUrl: true,
            },
          },
        },
      },
    },
  });
};

export default {
  CreateConfirmedQuote,
  findAllByDay,
  getAvailableReviewCount,
  getAvailableReviewList,
};
