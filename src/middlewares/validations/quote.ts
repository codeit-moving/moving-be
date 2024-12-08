import { Request, Response, NextFunction } from "express";
import customError from "../../utils/interfaces/customError";

export const validateCreateQuote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { movingRequestId, cost, comment } = req.body;

  if (!movingRequestId || !cost || !comment) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "필수 입력값이 누락되었습니다.",
    };
    return next(error);
  }

  next();
};
