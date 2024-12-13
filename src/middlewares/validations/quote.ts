import { RequestHandler } from "express";
import customError from "../../utils/interfaces/customError";

const createQuoteValidation: RequestHandler = (req, res, next) => {
  const { movingRequestId, cost, comment } = req.body;

  if (!movingRequestId || typeof movingRequestId !== "number") {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "이사 요청 ID가 올바르지 않습니다.",
    };
    return next(error);
  }

  if (!cost || typeof cost !== "number" || cost <= 0) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "견적 금액이 올바르지 않습니다.",
    };
    return next(error);
  }

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "견적 코멘트가 올바르지 않습니다.",
    };
    return next(error);
  }

  next();
};

export default { createQuoteValidation };
