// 테스트를 위한 임시 파일

import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

// 임시로 사용할 미들웨어
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // req를 AuthenticatedRequest로 타입 단언(type assertion)
  (req as AuthenticatedRequest).user = { id: 1 };
  next();
};
