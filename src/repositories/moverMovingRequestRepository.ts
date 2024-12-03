// repositories/moverRequestRepository.ts

import prismaClient from "../utils/prismaClient"; // Prisma 클라이언트를 가져옵니다.

interface MovingRequestQueryParams {
  services?: object; // 서비스 필터 (예: [1, 2])
  isDesignated?: boolean; // 지정 이사 요청 필터
  isRejected?: boolean; // 반려 요청 필터
  order?: "recent" | "date"; // 정렬 방식
  limit?: number; // 조회할 목록 수
  nextCursor?: number | null; // 다음 커서 (이사 요청 ID)
}

const getMovingRequestsForMover = async (params: MovingRequestQueryParams) => {
  const {
    services,
    isDesignated = false,
    isRejected = false,
    order = "recent",
    limit = 10,
    nextCursor = null,
  } = params;

  // 정렬 설정
  const orderBy =
    order === "date" ? { movingDate: "asc" } : { createAt: "asc" }; //이거 이사 빠른순하고 요청일 빠른순으로 바꿔야 돼(피그마 참조)

  // 검색 조건 설정
  const where: any = {
    isDesignated,
    isRejected,
    services: services ? { hasSome: services } : undefined,
  };

  // 커서 설정
  const cursorOptions = nextCursor
    ? { cursor: { id: nextCursor }, skip: 1 }
    : {};

  // 이사 요청 목록 조회
  const movingRequests = await prismaClient.movingRequest.findMany({
    where,
    orderBy,
    take: limit,
    ...cursorOptions,
    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  // 다음 커서 계산
  const lastRequest = movingRequests[movingRequests.length - 1];
  const newNextCursor = lastRequest ? lastRequest.id : null;

  // 전체 이사 요청 수 계산
  const totalCount = await prismaClient.movingRequest.count({ where });

  // 서비스별 이사 요청 수 계산
  const serviceCounts = await Promise.all(
    [0, 1, 2].map(async (serviceCode) => {
      return prismaClient.movingRequest.count({
        where: {
          ...where,
          services: { has: serviceCode },
        },
      });
    })
  );

  // 지정 이사 요청 수 계산
  const designateCount = await prismaClient.movingRequest.count({
    where: {
      ...where,
      isDesignated: true,
    },
  });

  return {
    nextCursor: newNextCursor,
    hasNext: movingRequests.length === limit,
    serviceCounts,
    designateCount,
    totalCount,
    list: movingRequests,
  };
};

export default {
  getMovingRequestsForMover,
};
