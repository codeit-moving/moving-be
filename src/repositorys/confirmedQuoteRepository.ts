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

export default { CreateConfirmedQuote };
