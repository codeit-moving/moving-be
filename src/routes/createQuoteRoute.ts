// createQuoteRoute.ts

// 필요한 모듈들을 가져옵니다.
import express from "express"; // Express 모듈
import createQuoteController from "../controllers/createQuoteController"; // 견적서 컨트롤러
import { authenticate } from "../middlewares/authMiddleware"; // 인증 미들웨어

// 라우터를 생성합니다.
const router = express.Router();

// 견적서 관련 엔드포인트에 인증 미들웨어를 적용합니다.
router.post("/", authenticate, createQuoteController);

// 라우터를 내보냅니다.
export default router;
