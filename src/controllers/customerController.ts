import customerService from "../services/customerService";
import { Router } from "express";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import { Payload } from "../utils/token.utils";
import upload from "../utils/multer";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("imageUrl"),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const profile = {
        userId: userId,
        imageUrl: req.file!,
        regions: req.body.regions
          ? Array.isArray(req.body.regions)
            ? req.body.regions.map(Number)
            : JSON.parse(req.body.regions).map(Number)
          : [],
        services: req.body.services
          ? Array.isArray(req.body.services)
            ? req.body.services.map(Number)
            : JSON.parse(req.body.services).map(Number)
          : [],
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
  upload.single("imageUrl"),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const profile = {
        ...req.body,
        imageUrl: req.file,
        regions: req.body.regions
          ? JSON.parse(req.body.regions).map(Number)
          : [],
        services: req.body.services
          ? JSON.parse(req.body.services).map(Number)
          : [],
      };
      await customerService.updateCustomerProfile(userId, profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
