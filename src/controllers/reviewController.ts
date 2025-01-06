import { Router } from "express";
import passport from "passport";
import { asyncHandle } from "../utils/asyncHandler";
import reviewService from "../services/reviewService";
import customError from "../utils/interfaces/customError";
import upload from "../utils/multer";
import { uploadOptionalFiles } from "../middlewares/uploadFile"; // 추가
import { throwHttpError } from "../utils/constructors/httpError";

interface User {
  customerId: number;
  // 다른 필요한 필드들...
}

const router = Router();

// 리뷰 목록 조회 (기사 상세페이지용)
router.get(
  "/mover/:moverId",
  asyncHandle(async (req, res) => {
    const moverId = parseInt(req.params.moverId);
    const { pageSize, pageNum } = req.query;

    const result = await reviewService.getMoverReviewsList(moverId, {
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      pageNum: pageNum ? parseInt(pageNum as string) : undefined,
    });

    res.status(200).send(result);
  })
);

// 내가 작성한 리뷰 목록 조회
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res) => {
    const user = req.user as User;
    const customerId = user.customerId;

    if (!customerId) {
      const error: customError = new Error("Bad Request");
      error.status = 400;
      error.message = "고객 ID가 필요합니다.";
      throw error;
    }

    const { pageSize, pageNum } = req.query;

    const result = await reviewService.getMyReviewsList(customerId, {
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      pageNum: pageNum ? parseInt(pageNum as string) : undefined,
    });

    res.status(200).send(result);
  })
);

// 리뷰 생성하기
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.array("imageUrl", 3), // 수정: images -> imageUrl로 변경 (DB 필드명과 일치)
  uploadOptionalFiles, // 미들웨어 추가
  asyncHandle(async (req, res) => {
    const user = req.user as User;
    const customerId = user.customerId;
    const confirmedQuoteId = parseInt(req.params.id);
    const { rating, content } = req.body;

    if (!customerId) {
      throwHttpError(400, "고객 ID가 필요합니다.");
    }

    if (!confirmedQuoteId || !rating) {
      throwHttpError(400, "필수 항목이 누락되었습니다.");
    }

    const result = await reviewService.createNewReview(customerId, {
      confirmedQuoteId: Number(confirmedQuoteId),
      rating: Number(rating),
      content,
      imageUrl: req.fileUrls || [], // S3에 업로드된 URL 배열 전달
    });

    res.status(201).send(result); // 수정: 201 Created 상태코드 사용
  })
);

// 작성 가능한 리뷰 목록 조회
router.get(
  "/available",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res) => {
    const user = req.user as User;
    const customerId = user.customerId;

    if (!customerId) {
      const error: customError = new Error("Bad Request");
      error.status = 400;
      error.message = "고객 ID가 필요합니다.";
      throw error;
    }

    const { pageSize, pageNum } = req.query;

    const result = await reviewService.getAvailableReviewsList(customerId, {
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      pageNum: pageNum ? parseInt(pageNum as string) : undefined,
    });

    res.status(200).send(result);
  })
);

export default router;
