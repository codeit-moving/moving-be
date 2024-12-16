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
        services: Array.isArray(req.body.services)
          ? req.body.services
          : JSON.parse(req.body.services),
        regions: Array.isArray(req.body.regions)
          ? req.body.regions
          : JSON.parse(req.body.regions), //postman으로 테스트하였는데 문자 배열로 인식하는 것 같아 임시 코드 작성 수정예정
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
      const profile = { ...req.body, imageUrl: req.file };
      await customerService.updateCustomerProfile(userId, profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
