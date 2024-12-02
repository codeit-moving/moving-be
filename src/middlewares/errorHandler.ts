import { ErrorRequestHandler } from "express";
import CustomError from "../utils/interfaces/customError";

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next
) => {
  const status = err.status ?? 500;
  if (status >= 500) {
    err.data = {
      message: "Internal Server Error",
    };
  }
  res.status(status).json({
    path: req.path,
    method: req.method,
    message: err.message ?? "Internal Server Error",
    data: err.data ?? undefined,
    date: new Date(),
  });
  next();
};

export default errorHandler;
