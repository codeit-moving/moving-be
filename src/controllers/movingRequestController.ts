import express from "express";
import movingRequestService from "../services/movingRequestService";
import { asyncHandle } from "../utils/asyncHandler";
import movingRequest from "../middlewares/validations/movingRequest";
import checkBoolean from "../utils/checkBoolean";

const router = express.Router();

router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: customerId } = req.user as { id: number };

      const { limit, isCompleted, cursor } = req.query;
      const parseLimit = limit ? parseInt(limit as string) : 10; //기본값 10
      const parseCursor = cursor ? parseInt(cursor as string) : null;
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

router.get(
  "/:id/quotes",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: movingRequestId } = req.params;
      const { id: customerId } = req.user as { id: number };
      const quotes = await movingRequestService.getQuoteByMovingRequestId(
        customerId,
        parseInt(movingRequestId)
      );
      return res.status(200).send(quotes);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  movingRequest.createMovingRequestValidation,
  asyncHandle(async (req, res, next) => {
    try {
      const { id: customerId } = req.user as { id: number };
      const movingRequest = await movingRequestService.createMovingRequest(
        customerId,
        req.body
      );
      return res.status(201).send(movingRequest);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/designated",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: movingRequestId } = req.params;
      const { id: moverId } = req.user as { id: number };
      const remainingCount = await movingRequestService.designateMover(
        parseInt(movingRequestId),
        moverId
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

router.delete(
  "/:id/designated",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: movingRequestId } = req.params;
      const { id: moverId } = req.user as { id: number };
      const remainingCount = await movingRequestService.cancelDesignateMover(
        parseInt(movingRequestId),
        moverId
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
