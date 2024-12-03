// routes/moverRequestRoutes.ts

import express from "express";
import { getMovingRequestsController } from "../controllers/moverRequestController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// 이사 요청 목록 조회 - 기사
router.get("/mover/requests", authenticate, getMovingRequestsController);

export default router;
