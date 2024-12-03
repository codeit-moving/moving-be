// controllers/moverRequestController.ts

import { Request, Response, NextFunction } from "express";
import { MoverRequestService } from "../services/moverRequestService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const moverRequestService = new MoverRequestService();

// 이사 요청 목록 조회 - 기사
export const getMovingRequestsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 쿼리 파라미터 추출
    const { services, isDesignated, isRejected, order, limit, nextCursor } =
      req.query;

    // 파라미터 파싱 및 유효성 검사
    let parsedServices: number[] | undefined;
    if (services) {
      if (Array.isArray(services)) {
        parsedServices = services.map(Number);
      } else if (typeof services === "string") {
        parsedServices = services.split(",").map(Number);
      } else {
        return res
          .status(400)
          .json({ message: "services 파라미터가 잘못되었습니다." });
      }
    }

    const parsedIsDesignated =
      isDesignated !== undefined ? isDesignated === "true" : undefined;
    const parsedIsRejected =
      isRejected !== undefined ? isRejected === "true" : undefined;
    const parsedOrder =
      order === "recent" || order === "date" ? order : "recent";
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
    const parsedNextCursor = nextCursor
      ? parseInt(nextCursor as string, 10)
      : undefined;

    const params = {
      services: parsedServices,
      isDesignated: parsedIsDesignated,
      isRejected: parsedIsRejected,
      order: parsedOrder as "recent" | "date",
      limit: parsedLimit,
      nextCursor: parsedNextCursor,
    };

    // 서비스 호출
    const result = await moverRequestService.getMovingRequests(params);

    // 결과 응답
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "서버 오류가 발생했습니다." });
  }
};
