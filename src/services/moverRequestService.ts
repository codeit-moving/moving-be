// services/moverRequestService.ts

import moverRequestRepository from "../repositories/moverRequestRepository";

interface MovingRequestQueryParams {
  services?: number[];
  isDesignated?: boolean;
  isRejected?: boolean;
  order?: "recent" | "date";
  limit?: number;
  nextCursor?: number | null;
}

export class MoverRequestService {
  async getMovingRequests(params: MovingRequestQueryParams) {
    // 기본값 설정 및 유효성 검사
    const {
      services,
      isDesignated = false,
      isRejected = false,
      order = "recent",
      limit = 10,
      nextCursor = null,
    } = params;

    if (limit < 1) {
      throw new Error("limit은 1 이상이어야 합니다.");
    }

    // 레포지토리의 getMovingRequestsForMover 함수 호출
    return await moverRequestRepository.getMovingRequestsForMover({
      services,
      isDesignated,
      isRejected,
      order,
      limit,
      nextCursor,
    });
  }
}
