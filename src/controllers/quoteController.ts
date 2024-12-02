import { Router } from "express";
import quoteService from "../services/quoteService";
import { asyncHandle } from "../utils/asyncHandler";
const router = Router();

router.get(
  "/:id",
  asyncHandle(async (req, res, next) => {
    try {
      //추후 로그인 구현 시 수정
      //const { id: customerId } = req.user as { id: number };
      const { id: quoteId } = req.params;
      const quote = await quoteService.getQuoteById(1, parseInt(quoteId));
      return res.status(200).send(quote);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
