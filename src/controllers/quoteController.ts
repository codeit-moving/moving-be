import express, { Request, Response } from "express";
import quoteService from "../services/quoteService";
import { asyncHandle } from "../utils/asyncHandler";
import passport from "passport";
import customError from "../utils/interfaces/customError";

const router = express.Router();

// 견적서 생성 엔드포인트를 정의
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req: Request, res: Response, next) => {
    try {
      const { id: moverId } = req.user as { id: number };
      const { movingRequestId, cost, comment } = req.body;

      // 필수 입력값들이 모두 있는지 확인
      if (!movingRequestId || !cost || !comment) {
        const error: customError = new Error("Bad Request");
        error.status = 400;
        error.message = "Bad Request";
        error.data = {
          message: "필수 입력값이 누락되었습니다.",
        };
        throw error;
      }

      // 견적서를 생성하는 서비스를 호출
      const quote = await quoteService.createQuote(
        parseInt(movingRequestId), // 이사 요청 아이디를 숫자로 변환해서 전달
        moverId, // 기사님의 아이디를 전달
        parseInt(cost), // 견적가를 숫자로 변환해서 전달해요.
        comment // 코멘트를 전달해요.
      );

      // 견적서가 성공적으로 생성되었다는 응답을 보내요.
      return res.status(201).json({
        success: true,
        message: "견적서가 성공적으로 생성되었습니다.",
        data: quote, // 생성된 견적서 정보를 포함해요.
      });
    } catch (error) {
      next(error); // 에러가 발생하면 에러 처리기로 넘겨요.
    }
  })
);

// 📌 **기사님이 작성한 견적서 목록을 조회하는 엔드포인트를 정의합니다.**
router.get(
  "/mover", // "/mover" 경로로 GET 요청이 오면 처리해요.
  passport.authenticate("jwt", { session: false }), // 사용자가 로그인했는지 확인해요.
  asyncHandle(async (req: Request, res: Response, next) => {
    try {
      const { id: moverId } = req.user as { id: number }; // 로그인한 기사님의 아이디를 가져와요.

      // 기사님이 작성한 견적서 목록을 가져와요.
      const quotes = await quoteService.getQuoteList(moverId);

      // 견적서 목록 조회 성공 응답을 보내요.
      return res.status(200).json({
        success: true,
        message: "견적서 목록 조회 성공",
        data: quotes, // 견적서 목록을 포함해요.
      });
    } catch (error) {
      next(error); // 에러가 발생하면 에러 처리기로 넘겨요.
    }
  })
);

// 📌 **기사님이 작성한 특정 견적서의 상세 정보를 조회하는 엔드포인트를 정의합니다.**
router.get(
  "/mover/:quoteId", // "/mover/견적서아이디" 경로로 GET 요청이 오면 처리해요.
  passport.authenticate("jwt", { session: false }), // 사용자가 로그인했는지 확인해요.
  asyncHandle(async (req: Request, res: Response, next) => {
    try {
      const { id: moverId } = req.user as { id: number }; // 로그인한 기사님의 아이디를 가져와요.
      const quoteId = parseInt(req.params.quoteId); // URL에서 견적서 아이디를 가져와 숫자로 변환해요.
      const cost = parseInt(req.query.cost as string); // 쿼리에서 비용 정보를 가져와 숫자로 변환해요.

      // 견적서 아이디나 비용이 숫자가 아니면 에러를 발생시켜요.
      if (isNaN(quoteId) || isNaN(cost)) {
        const error: customError = new Error("Bad Request"); // 에러 객체를 만들어요.
        error.status = 400; // 에러 상태 코드를 설정해요.
        error.message = "Bad Request"; // 에러 메시지를 설정해요.
        error.data = {
          message: "올바르지 않은 파라미터입니다.", // 상세한 에러 메시지를 설정해요.
        };
        throw error; // 에러를 발생시켜요.
      }

      // 견적서 상세 정보를 가져오는 서비스를 호출해요.
      const quote = await quoteService.getQuoteDetail(moverId, quoteId, cost);

      // 견적서 상세 조회 성공 응답을 보내요.
      return res.status(200).json({
        success: true,
        message: "견적서 상세 조회 성공",
        data: quote, // 견적서 상세 정보를 포함해요.
      });
    } catch (error) {
      next(error); // 에러가 발생하면 에러 처리기로 넘겨요.
    }
  })
);

export default router; // 설정한 라우터를 내보내서 다른 파일에서 사용할 수 있게 해요.
