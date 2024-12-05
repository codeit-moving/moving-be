import moverService from "../services/moverService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";
import checkBoolean from "../utils/checkBoolean";
import passport from "passport";

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
  passport.authenticate("jwt-optional", { session: false }),
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

//기사 상세 조회
router.get(
  "/:id",
  passport.authenticate("jwt-optional", { session: false }),
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
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id: moverId } = req.params;
      const { favorite = "true" } = req.query;
      const mover = await moverService.toggleFavorite(
        customerId,
        parseInt(moverId),
        checkBoolean(favorite as string)
      );
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
