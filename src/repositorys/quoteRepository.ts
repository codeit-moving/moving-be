import prismaClient from "../utils/prismaClient";

//이사요청에 대한 견적서 조회
const getQuoteByMovingRequestId = (movingRequestId: number) => {
  return prismaClient.quote.findMany({
    where: { movingRequestId },
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

export default {
  getQuoteByMovingRequestId,
};
