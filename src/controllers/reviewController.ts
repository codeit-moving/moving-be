import { Router } from "express";
import passport from "passport";
import { asyncHandle } from "../utils/asyncHandler";
import reviewService from "../services/reviewService";
import customError from "../utils/interfaces/customError";
import { ReviewCreateData, ReviewQuery } from "../utils/review/types";
import { uploadFile } from "../utils/s3.utils";
import upload from "../utils/multer";

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
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.array("imageUrl", 3), // 수정: images -> imageUrl로 변경 (DB 필드명과 일치)
  asyncHandle(async (req, res) => {
    const user = req.user as User;
    const customerId = user.customerId;
    const { confirmedQuoteId, rating, content } = req.body;

    if (!customerId) {
      const error: customError = new Error("Bad Request");
      error.status = 400;
      error.message = "고객 ID가 필요합니다.";
      throw error;
    }

    if (!confirmedQuoteId || !rating) {
      const error: customError = new Error("Bad Request");
      error.status = 400;
      error.message = "필수 항목이 누락되었습니다.";
      throw error;
    }

    // 이미지 파일 처리 로직
    let imageUrl: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            imageUrl.push(uploadedUrl);
          }
        } catch (error) {
          const uploadError: customError = new Error("Internal Server Error");
          uploadError.status = 500;
          uploadError.message = "Internal Server Error";
          uploadError.data = {
            message: "이미지 업로드에 실패했습니다.",
          };
          throw uploadError;
        }
      }
    }

    const result = await reviewService.createNewReview(customerId, {
      confirmedQuoteId,
      rating,
      content,
      imageUrl, // S3에 업로드된 URL 배열 전달
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

    console.log(result);
    res.status(200).send(result);
  })
);

export default router;
