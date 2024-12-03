//createQuoteController.ts

// 필요한 모듈들을 가져옵니다.
import express from "express"; // Express 모듈
import createQuoteService from "../services/createQuoteService"; // 견적서 서비스 함수들
import { asyncHandle } from "../utils/asyncHandler"; // 비동기 함수 에러 처리를 위한 핸들러

// 라우터를 생성합니다.
const router = express.Router();

// 견적서 생성 엔드포인트를 정의합니다.
router.post(
  "/", // 엔드포인트 경로 (예: "/quotes")
  asyncHandle(async (req, res, next) => {
    try {
      // 요청에서 기사님의 아이디를 가져옵니다. (인증된 사용자 정보)
      const { id: moverId } = req.user as { id: number };

      // 요청 바디에서 필요한 데이터를 가져옵니다.
      const { id: movingRequestId, cost, comment } = req.body;

      // 필요한 값들이 모두 있는지 확인합니다.
      if (!movingRequestId || cost === undefined || !comment) {
        return res.status(400).json({
          message: "이사 요청 아이디, 견적가, 코멘트를 모두 입력해주세요.",
        });
      }

      // 서비스 함수를 호출하여 견적서를 생성합니다.
      const quote = await createQuoteService.createQuote(
        Number(movingRequestId),
        moverId,
        Number(cost),
        comment
      );

      // 성공적으로 생성되었음을 응답합니다.
      return res.status(200).json(quote);
    } catch (error) {
      // 에러가 발생하면 에러 처리 미들웨어로 전달합니다.
      next(error);
    }
  })
);

// 라우터를 내보냅니다.
export default router;
