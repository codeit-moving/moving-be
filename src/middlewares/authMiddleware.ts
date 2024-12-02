import { asyncHandle } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";
import CustomError from "../utils/interfaces/customError";

const authenticateJWT = asyncHandle(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "토큰이 없습니다.",
    };
    throw error;
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const error: CustomError = new Error("Forbidden");
    error.status = 403;
    error.data = {
      message: "유효하지 않은 토큰입니다.",
    };
    throw error;
  }
});

export default authenticateJWT;
