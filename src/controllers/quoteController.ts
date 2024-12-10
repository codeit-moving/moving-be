import express, { Request, Response } from "express";
import quoteService from "../services/quoteService";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import customError from "../utils/interfaces/customError";
import quoteValidation from "../middlewares/validations/quote";

const router = express.Router();

// 견적서 생성 엔드포인트를 정의
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  quoteValidation.createQuoteValidation,
  asyncHandle(async (req: Request, res: Response) => {
    const { moverId } = req.user as { moverId: number };
    const { movingRequestId, cost, comment } = req.body;

    // 견적서를 생성하는 서비스를 호출
    const quote = await quoteService.createQuote(
      movingRequestId,
      moverId,
      cost,
      comment
    );

    // 견적서가 성공적으로 생성되었다는 응답을 보내요.
    return res.status(201).json({
      success: true,
      message: "견적서가 성공적으로 생성되었습니다.",
      data: quote, // 생성된 견적서 정보를 포함
    });
  })
);

// 기사님이 작성한 견적서 목록을 조회하는 엔드포인트를 정의
router.get(
  "/mover",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    // user 객체의 구조를 더 자세히 확인
    const user = req.user as any; // 임시로 any 타입 사용

    // user 객체에서 moverId를 찾는 방법 수정
    const moverId = user.moverId; // user.id를 먼저 확인

    if (!moverId) {
      const error: customError = new Error("Unauthorized");
      error.status = 401;
      error.message = "Unauthorized";
      error.data = {
        message: "기사 정보를 찾을 수 없습니다.",
      };
      throw error;
    }

    const quotes = await quoteService.getQuoteList(moverId);

    return res.status(200).json({
      success: true,
      message: "견적서 목록 조회 성공",
      data: quotes,
    });
  })
);

// 기사님이 작성한 특정 견적서의 상세 정보를 조회하는 엔드포인트를 정의
router.get(
  "/mover/:quoteId",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    const user = req.user as any;
    const moverId = user.moverId;

    if (!moverId) {
      const error: customError = new Error("Unauthorized");
      error.status = 401;
      error.message = "Unauthorized";
      error.data = {
        message: "기사 정보를 찾을 수 없습니다.",
      };
      throw error;
    }

    const quoteId = parseInt(req.params.quoteId);
    const cost = parseInt(req.query.cost as string);

    if (isNaN(quoteId) || isNaN(cost)) {
      const error: customError = new Error("Bad Request");
      error.status = 400;
      error.message = "Bad Request";
      error.data = {
        message: "올바르지 않은 파라미터입니다.",
      };
      throw error;
    }

    const quote = await quoteService.getQuoteDetail(moverId, quoteId, cost);

    return res.status(200).json({
      success: true,
      message: "견적서 상세 조회 성공",
      data: quote,
    });
  })
);

export default router; // 설정한 라우터를 내보내서 다른 파일에서 사용할 수 있게 해요.
