import express from "express";
import movingRequestService from "../services/movingRequestService";
import { asyncHandle } from "../utils/asyncHandler";
import movingRequest from "../middlewares/validations/movingRequest";
import checkBoolean from "../utils/checkBoolean";
import passport from "passport";

const router = express.Router();

//이사요청 목록 조회
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };

      const { limit = "10", isCompleted = "", cursor = "0" } = req.query;
      const parseLimit = parseInt(limit as string);
      const parseCursor = parseInt(cursor as string);
      const parseIsCompleted = checkBoolean(isCompleted as string);

      const movingRequestList = await movingRequestService.getMovingRequestList(
        customerId,
        {
          limit: parseLimit,
          isCompleted: parseIsCompleted,
          cursor: parseCursor,
        }
      );
      return res.status(200).send(movingRequestList);
    } catch (error) {
      next(error);
    }
  })
);

//이사요청의 견적서 목록 조회
router.get(
  "/:id/quotes",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id: movingRequestId } = req.params;
      const { isCompleted = "" } = req.query;
      const parseIsCompleted = checkBoolean(isCompleted as string);
      const quotes = await movingRequestService.getQuoteByMovingRequestId(
        customerId,
        parseInt(movingRequestId),
        parseIsCompleted
      );
      return res.status(200).send(quotes);
    } catch (error) {
      next(error);
    }
  })
);

//대기중인 견적서 조회
router.get(
  "/pending-quotes",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const pendingQuotes = await movingRequestService.getPendingQuotes(
        customerId
      );
      return res.status(200).send(pendingQuotes);
    } catch (error) {
      next(error);
    }
  })
);

//이사요청 생성
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  movingRequest.createMovingRequestValidation, //유효성 검사
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { service, movingDate, pickupAddress, dropOffAddress } = req.body;
      const date = new Date(movingDate);
      const movingRequest = await movingRequestService.createMovingRequest(
        customerId,
        {
          service,
          movingDate: date,
          pickupAddress,
          dropOffAddress,
        }
      );
      return res.status(201).send(movingRequest);
    } catch (error) {
      next(error);
    }
  })
);

//이사요청 기사 지정하기
router.post(
  "/:id/designated",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: movingRequestId } = req.params;
      const { moverId } = req.query;
      const remainingCount = await movingRequestService.designateMover(
        parseInt(movingRequestId),
        parseInt(moverId as string)
      );
      return res.status(200).send({
        message: "지정 요청 완료",
        designateRemain: remainingCount,
      });
    } catch (error) {
      next(error);
    }
  })
);

//이사요청 기사 지정 취소하기
router.delete(
  "/:id/designated",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: movingRequestId } = req.params;
      const { moverId } = req.query;
      const remainingCount = await movingRequestService.cancelDesignateMover(
        parseInt(movingRequestId),
        parseInt(moverId as string)
      );
      return res.status(200).send({
        message: "지정 요청 취소",
        designateRemain: remainingCount,
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
