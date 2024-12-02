import prismaClient from "../utils/prismaClient";

//이사요청에 대한 견적서 조회
const getQuoteByMovingRequestId = (
  movingRequestId: number,
  isCompleted: boolean
) => {
  return prismaClient.quote.findMany({
    where: {
      movingRequestId,
      ...(isCompleted
        ? {
            confirmedQuote: {
              isNot: null, //환정견적과의 관계가 null이 아닌 경우
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
          serviceType: true,
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
          movingRequest: {
            select: {
              id: true,
              serviceType: true,
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
      mover: {
        select: {
          id: true,
          nickname: true,
          imageUrl: true,
          career: true,
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
          movingRequest: {
            select: {
              id: true,
              serviceType: true,
              mover: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      movingRequest: {
        select: {
          id: true,
          serviceType: true,
          createAt: true,
          movingDate: true,
          pickupAddress: true,
          dropOffAddress: true,
          mover: {
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
};
