import { Router } from "express";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import userService from "../services/userService";
import { Payload } from "../utils/token.utils";

const router = Router();

router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const userData = req.body;
      await userService.updateUser(userId, userData);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const user = await userService.getUser(userId);
      res.status(200).send({ user });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
