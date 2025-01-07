import { RequestHandler } from "express";
import customError from "../../utils/interfaces/customError";
import { throwHttpError } from "../../utils/constructors/httpError";

const createQuoteValidation: RequestHandler = (req, res, next) => {
  const { movingRequestId, cost, comment } = req.body;

  if (!movingRequestId || typeof movingRequestId !== "number") {
    return throwHttpError(400, "이사 요청 ID가 올바르지 않습니다.");
  }

  if (!cost || typeof cost !== "number" || cost <= 0) {
    return throwHttpError(400, "견적 금액이 올바르지 않습니다.");
  }

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    return throwHttpError(400, "견적 코멘트가 올바르지 않습니다.");
  }

  next();
};

export default { createQuoteValidation };
