import prismaClient from "../utils/prismaClient";

const getQuoteCountByMovingRequestId = (movingRequestId: number) => {
  return prismaClient.quote.count({
    where: { movingRequestId },
  });
};

//이사요청에 대한 견적서 조회
const getQuoteByMovingRequestId = (
  movingRequestId: number,
  isCompleted = false
) => {
  return prismaClient.quote.findMany({
    where: {
      movingRequestId,
      ...(isCompleted
        ? {
            confirmedQuote: {
              isNot: null, //확정견적과의 관계가 null이 아닌 경우
            },
          }
        : {}),
    },
    select: {
      id: true,
      cost: true,
      comment: true,
      movingRequest: {
        select: {
          service: true,
        },
      },
      confirmedQuote: {
        select: {
          id: true,
        },
      },
      mover: {
        select: {
          id: true,
          nickname: true,
          imageUrl: true,
          career: true,
          introduction: true,
          services: true,
          _count: {
            select: {
              review: true,
              favorite: true,
              confirmedQuote: true,
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
          movingRequest: {
            select: {
              id: true,
              service: true,
            },
          },
        },
      },
    },
  });
};

//견적서 상세 조회
const getQuoteById = (quoteId: number) => {
  return prismaClient.quote.findUnique({
    where: { id: quoteId },
    select: {
      id: true,
      cost: true,
      comment: true,
      movingRequest: {
        select: {
          service: true,
          createAt: true,
          movingDate: true,
          pickupAddress: true,
          dropOffAddress: true,
          confirmedQuote: {
            select: {
              id: true,
            },
          },
        },
      },
      confirmedQuote: {
        select: {
          id: true,
        },
      },
      mover: {
        select: {
          id: true,
          nickname: true,
          imageUrl: true,
          introduction: true,
          services: true,
          regions: true,
          // review: true,
          career: true,
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              review: true,
              favorite: true,
              confirmedQuote: true,
            },
          },
          favorite: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export default {
  getQuoteByMovingRequestId,
  getQuoteById,
  getQuoteCountByMovingRequestId,
};
