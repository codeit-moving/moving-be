import moverService from "../services/moverService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";
import checkBoolean from "../utils/checkBoolean";

interface queryString {
  nextCursorId: string;
  order: string;
  region: string;
  service: string;
  keyword: string;
  limit: string;
}

const router = express.Router();

router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      //나중에 토큰의 검사가 가능할때 업데이트 필요
      const { id: customerId } = req.user as { id: number | null };

      const {
        nextCursorId = "0",
        order = "",
        limit = "10",
        keyword = "",
        region = "0",
        service = "0",
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
  "/:id",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: moverId } = req.params;
      const { id: customerId } = req.user as { id: number | null };

      const parseMoverId = parseInt(moverId);

      const mover = await moverService.getMoverDetail(customerId, parseMoverId);
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/favorite",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: moverId } = req.params;
      const { id: customerId } = req.user as { id: number };
      const { favorite = "true" } = req.query;
      checkBoolean(favorite as string);
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
