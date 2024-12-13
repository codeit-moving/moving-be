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
          _count: {
            select: {
              review: true,
              favorite: true,
              confirmedQuote: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
        },
      },
    },
  });
};

export default { CreateConfirmedQuote };
