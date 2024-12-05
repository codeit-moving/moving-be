import { Router } from "express";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import userService from "../services/userService";

interface Payload {
  id: number;
  customerId: number | null;
  moverId: number | null;
  iat: number;
  exp: number;
}

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

export default router;
