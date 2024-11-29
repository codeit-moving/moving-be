import moverService from "../services/moverService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";
import checkBoolean from "../utils/checkBoolean";

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
