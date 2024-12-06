import express from "express";
import confirmedQuoteService from "../services/confirmedQuoteService";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "../middlewares/passport";

const router = express.Router();

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { customerId } = req.user as { customerId: number };
      const { id } = req.params;
      const confirmedQuote = await confirmedQuoteService.createConfirmedQuote({
        quoteId: parseInt(id),
        customerId,
      });
      res.status(201).json(confirmedQuote);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
