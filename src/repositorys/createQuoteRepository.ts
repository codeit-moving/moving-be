// createQuoteRepository.ts

// Prisma 클라이언트를 가져옵니다. (데이터베이스와 대화하는 도구예요)
import prismaClient from "../utils/prismaClient";

// (기사 입장에서의) 견적서에 대한 '견적서 생성' 함수
const createQuoteByMovingRequestId = async (
  movingRequestId: number,
  moverId: number,
  cost: number,
  comment: string
) => {
  return prismaClient.quote.create({
    data: {
      movingRequestId,
      moverId,
      cost,
      comment,
    },
    select: {
      id: true,
      cost: true,
      comment: true,
      movingRequest: {
        select: {
          pickupAddress: true,
          dropOffAddress: true,
          movingDate: true,
          isDesignated: true,
          serviceType: true,
        },
      },
    },
  });
};

export default {
  createQuoteByMovingRequestId,
};
