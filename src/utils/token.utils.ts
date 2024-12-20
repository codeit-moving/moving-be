// utils/token.utils.ts
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../env";

export interface Payload {
  id: number;
  customer?: { id: number } | null;
  mover?: { id: number } | null;
  iat?: number;
  exp?: number;
}

const createToken = (user: Payload, type: "access" | "refresh" = "access") => {
  const payload = {
    id: user.id,
    customerId: user.customer?.id || null,
    moverId: user.mover?.id || null,
  };

  const options = {
    expiresIn: type === "access" ? "1h" : "7d",
  };

  const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;

  return jwt.sign(payload, secret, options);
};

export default createToken;
