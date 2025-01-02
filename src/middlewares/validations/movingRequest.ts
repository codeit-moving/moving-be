import { RequestHandler } from "express";
import customError from "../../utils/interfaces/customError";
import { throwHttpError } from "../../utils/constructors/httpError";

const createMovingRequestValidation: RequestHandler = (req, res, next) => {
  const { service, movingDate, pickupAddress, dropOffAddress, region } =
    req.body;

  if (!service || typeof service !== "number" || service < 1 || service > 3) {
    return throwHttpError(400, "이사 서비스 타입이 올바르지 않습니다.");
  }
  const date = new Date(movingDate);
  if (!movingDate || !(date instanceof Date)) {
    return throwHttpError(400, "이사 날짜가 올바르지 않습니다.");
  }

  if (!pickupAddress || typeof pickupAddress !== "string") {
    return throwHttpError(400, "이사 출발지가 올바르지 않습니다.");
  }

  if (!dropOffAddress || typeof dropOffAddress !== "string") {
    return throwHttpError(400, "이사 도착지가 올바르지 않습니다.");
  }

  if (!region || typeof region !== "number") {
    return throwHttpError(400, "지역코드가 올바르지 않습니다.");
  }

  next();
};

export default { createMovingRequestValidation };
