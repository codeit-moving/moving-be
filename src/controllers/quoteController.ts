import express, { Request, Response } from "express";
import quoteService from "../services/quoteService";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import customError from "../utils/interfaces/customError";
import quoteValidation from "../middlewares/validations/quote";
import { isCustomer } from "../middlewares/authMiddleware";
import { throwHttpError } from "../utils/constructors/httpError";

const router = express.Router();

// 견적서 생성하기
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

    return res.status(201).send(quote);
  })
);

// (기사님이 작성한) 견적서 목록 조회
router.get(
  "/mover",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    // user 객체의 구조를 더 자세히 확인
    const user = req.user as any; // 임시로 any 타입 사용

    // user 객체에서 moverId를 찾는 방법 수정
    const moverId = user.moverId; // user.id를 먼저 확인

    if (!moverId) {
      return throwHttpError(401, "기사 정보를 찾을 수 없습니다.");
    }

    // 기본값 설정
    const limit = Number(req.query.limit) || 10;
    const nextCursorId = req.query.nextCursorId
      ? Number(req.query.nextCursorId)
      : null;

    const quotes = await quoteService.getQuoteList(moverId, {
      limit,
      cursor: nextCursorId, // 내부적으로는 cursor로 사용
    });

    return res.status(200).send(quotes);
  })
);

// (기사님이) 반려한 이사 요청 목록 조회
router.get(
  "/mover/rejected",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    const user = req.user as any;
    const moverId = user.moverId;

    // moverId 유효성 검사
    if (!moverId) {
      return throwHttpError(400, "기사 ID가 필요합니다.");
    }

    // 쿼리 파라미터 처리 (페이지네이션)
    const limit = parseInt(req.query.limit as string) || 10;
    const nextCursorId = req.query.nextCursorId
      ? Number(req.query.nextCursorId)
      : null;

    // 서비스 호출
    const result = await quoteService.getRejectedRequestList(moverId, {
      limit,
      cursor: nextCursorId,
    });

    // 응답
    res.status(200).send(result);
  })
);

// (기사님의) 지정이사 요청 반려
router.post(
  "/mover/:movingRequestId/reject",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    const user = req.user as any;
    const moverId = user.moverId;
    const movingRequestId = parseInt(req.params.movingRequestId);

    // 파라미터 검증
    if (!movingRequestId) {
      return throwHttpError(400, "이사 요청 ID가 필요합니다.");
    }

    const result = await quoteService.rejectRequest(moverId, movingRequestId);

    res.status(200).send(result);
  })
);

// (기사님이 작성한)특정 견적서 상세 조회회
router.get(
  "/mover/:quoteId",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    const user = req.user as any;
    const moverId = user.moverId;

    if (!moverId) {
      return throwHttpError(401, "기사 정보를 찾을 수 없습니다.");
    }

    const quoteId = parseInt(req.params.quoteId);

    if (isNaN(quoteId)) {
      return throwHttpError(400, "올바르지 않은 파라미터입니다.");
    }

    const quote = await quoteService.getQuoteDetail(moverId, quoteId);

    return res.status(200).send(quote);
  })
);

//견적서 상세 조회
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isCustomer,
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id: quoteId } = req.params;
      const quote = await quoteService.getQuoteById(
        customerId,
        parseInt(quoteId)
      );
      return res.status(200).send(quote);
    } catch (error) {
      next(error);
    }
  })
);

export default router; // 설정한 라우터를 내보내서 다른 파일에서 사용할 수 있게 해요.
