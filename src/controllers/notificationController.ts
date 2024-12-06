import { Router } from "express";
import notificationService from "../services/notificationService";
import passport from "passport";
import { asyncHandle } from "../utils/asyncHandler";
import { Payload } from "../utils/token.utils";

const router = Router();

//알림 조회
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const query = {
        isRead: req.query.isRead === "true",
        limit: parseInt(req.query.limit as string) || 10,
        lastCursorId: parseInt(req.query.lastCursorId as string) || undefined,
      };
      const notifications = await notificationService.findNotifications(
        userId,
        query
      );
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  })
);

//알림 읽음 처리
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const notificationId = parseInt(req.params.id);
      await notificationService.isReadNotification(notificationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
