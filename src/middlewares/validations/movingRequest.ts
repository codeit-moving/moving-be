import { RequestHandler } from "express";
import customError from "../../utils/interfaces/customError";

const createMovingRequestValidation: RequestHandler = (req, res, next) => {
  const { serviceType, movingDate, pickupAddress, dropOffAddress } = req.body;

  if (
    !serviceType ||
    typeof serviceType !== "number" ||
    serviceType < 1 ||
    serviceType > 3
  ) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "이사 서비스 타입이 올바르지 않습니다.",
    };
    return next(error);
  }

  const date = new Date(movingDate);
  if (!movingDate || !(date instanceof Date)) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "이사 날짜가 올바르지 않습니다.",
    };
    return next(error);
  }

  if (!pickupAddress || typeof pickupAddress !== "string") {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "이사 출발지가 올바르지 않습니다.",
    };
    return next(error);
  }

  if (!dropOffAddress || typeof dropOffAddress !== "string") {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "이사 도착지가 올바르지 않습니다.",
    };
    return next(error);
  }

  next();
};

export default { createMovingRequestValidation };
