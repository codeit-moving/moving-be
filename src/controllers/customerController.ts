import customerService from "../services/customerService";
import { Router } from "express";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import { Payload } from "../utils/token.utils";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const profile = {
        userId: userId,
        ...req.body,
      };
      await customerService.createCustomerProfile(profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const profile = req.body;
      await customerService.updateCustomerProfile(userId, profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
