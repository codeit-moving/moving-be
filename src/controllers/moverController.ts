import moverService from "../services/moverService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";
import checkBoolean from "../utils/checkBoolean";
import passport from "passport";
import {
  isCustomer,
  isMover,
  optionalJwtAuth,
} from "../middlewares/authMiddleware";
import upload from "../utils/multer";
import createToken, { Payload } from "../utils/token.utils";
import { uploadFiles, uploadOptionalFiles } from "../middlewares/uploadFile";
import cookieConfig from "../config/cookie.config";

interface queryString {
  nextCursorId: string;
  order: string;
  region: string;
  service: string;
  keyword: string;
  limit: string;
  isFavorite: string;
}

const router = express.Router();

//기사 목록 조회
router.get(
  "/",
  optionalJwtAuth,
  asyncHandle(async (req, res, next) => {
    try {
      let customerId: number | null = null;
      if (req.user) {
        customerId = (req.user as { customerId: number | null }).customerId;
      }
      const {
        nextCursorId = "0",
        order = "",
        limit = "10",
        keyword = "",
        region = "0",
        service = "0",
        isFavorite = "false",
      } = req.query as unknown as queryString;

      //스크링 쿼리 파싱
      const parseCursor = parseInt(nextCursorId);
      const parseRegion = parseInt(region);
      const parseService = parseInt(service);
      const parseLimit = parseInt(limit);
      const movers = await moverService.getMoverList(
        {
          cursor: parseCursor,
          limit: parseLimit,
          order,
          keyword,
          region: parseRegion,
          service: parseService,
          isFavorite,
        },
        customerId
      );
      return res.status(200).send(movers);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/my-profile",
  passport.authenticate("jwt", { session: false }),
  isMover,
  asyncHandle(async (req, res, next) => {
    try {
      const { moverId } = req.user as { moverId: number };
      const mover = await moverService.getMover(moverId);
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

//찜한 기사 목록 조회
router.get(
  "/favorite-list",
  passport.authenticate("jwt", { session: false }),
  isCustomer,
  asyncHandle(async (req, res, next) => {
    try {
      const { limit = "10", nextCursorId = "0" } = req.query;
      const parseLimit = parseInt(limit as string);
      const parseNextCursorId = parseInt(nextCursorId as string);
      const { customerId } = req.user as { customerId: number };
      const movers = await moverService.getMoverByFavorite(
        customerId,
        parseLimit,
        parseNextCursorId
      );
      return res.status(200).send(movers);
    } catch (error) {
      next(error);
    }
  })
);

//기사 상세 조회
router.get(
  "/:id",
  optionalJwtAuth,
  asyncHandle(async (req, res, next) => {
    try {
      let customerId: number | null = null;
      if (req.user) {
        customerId = (req.user as { customerId: number | null }).customerId;
      }

      const { id: moverId } = req.params;

      const parseMoverId = parseInt(moverId);

      const mover = await moverService.getMoverDetail(customerId, parseMoverId);
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

//기사 찜
router.post(
  "/:id/favorite",
  passport.authenticate("jwt", { session: false }),
  isCustomer,
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id: moverId } = req.params;
      const mover = await moverService.moverFavorite(
        customerId,
        parseInt(moverId)
      );
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

//기사 찜 취소
router.delete(
  "/:id/favorite",
  passport.authenticate("jwt", { session: false }),
  isCustomer,
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id: moverId } = req.params;
      const mover = await moverService.moverFavoriteCancel(
        customerId,
        parseInt(moverId)
      );
      return res.status(200).send(mover);
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
      const moverId = (req.user as { moverId: number }).moverId;
      const profile = {
        ...req.body,
        imageUrl: req.fileUrls,
        career: parseInt(req.body.career),
        regions: JSON.parse(req.body.regions).map(Number),
        services: JSON.parse(req.body.services).map(Number),
      };
      await moverService.updateMoverProfile(userId, moverId, profile);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

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
        ...req.body,
        imageUrl: req.fileUrls,
        career: parseInt(req.body.career),
        regions: JSON.parse(req.body.regions).map(Number),
        services: JSON.parse(req.body.services).map(Number),
      };
      const { id } = await moverService.createMoverProfile(profile);

      const payload = { id: userId, mover: { id: id } };

      const accessToken = createToken(payload, "access");
      res.cookie("accessToken", accessToken, cookieConfig.accessTokenOption);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
);

export default router;
