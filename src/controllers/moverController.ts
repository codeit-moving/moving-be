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
  isFavorite: string;
}

const router = express.Router();

//기사 목록 조회
router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      //나중에 토큰의 검사가 가능할때 업데이트 필요
      let customerId: number | null = null;
      if (req.user) {
        customerId = (req.user as { id: number | null }).id;
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
        1
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
  //미들웨어
  asyncHandle(async (req, res, next) => {
    try {
      //나중에 토큰의 검사가 가능할때 업데이트 필요
      // let customerId: number | null = null;
      // if (req.user) {
      //   customerId = (req.user as { id: number | null }).id;
      // }

      const { id: moverId } = req.params;

      const parseMoverId = parseInt(moverId);

      const mover = await moverService.getMoverDetail(1, parseMoverId);
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

//기사 찜
router.post(
  "/:id/favorite",
  asyncHandle(async (req, res, next) => {
    try {
      //나중에 토큰의 검사가 가능할때 업데이트 필요
      // const { id: customerId } = req.user as { id: number };
      const { id: moverId } = req.params;
      const { favorite = "true" } = req.query;
      const mover = await moverService.toggleFavorite(
        1,
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
