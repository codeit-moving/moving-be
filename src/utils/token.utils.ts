// utils/token.utils.ts
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../env";

interface TokenUser {
  id: number;
  customer?: { id: number } | null;
  mover?: { id: number } | null;
}

const createToken = (
  user: TokenUser,
  type: "access" | "refresh" = "access"
) => {
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
