import customerService from "../services/customerService";
import { Router } from "express";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import { Payload } from "../utils/token.utils";
import upload from "../utils/multer";
import { uploadFiles, uploadOptionalFiles } from "../middlewares/uploadFile";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.array("imageUrl"),
  uploadFiles,
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const profile = {
        userId: userId,
        imageUrl: req.fileUrls!,
        regions: JSON.parse(req.body.regions).map(Number),
        services: JSON.parse(req.body.services).map(Number),
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
  upload.array("imageUrl"),
  uploadOptionalFiles,
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as Payload).id;
      const customerId = (req.user as { customerId: number }).customerId;
      const profile = {
        imageUrl: req.fileUrls,
        regions: JSON.parse(req.body.regions).map(Number),
        services: JSON.parse(req.body.services).map(Number),
      };
      await customerService.updateCustomerProfile(userId, customerId, profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
