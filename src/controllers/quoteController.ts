import { Router } from "express";
import quoteService from "../services/quoteService";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
const router = Router();

//견적서 상세 조회
router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      // const { customerId } = req.user as { customerId: number };
      const { id: quoteId } = req.params;
      const quote = await quoteService.getQuoteById(1, parseInt(quoteId));
      return res.status(200).send(quote);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
