import moverService from "../services/moverService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";

const router = express.Router();

router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const movers = await moverService.getMoverList(req);
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
      const mover = await moverService.getMoverDetail(req);
      return res.status(200).send(mover);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
