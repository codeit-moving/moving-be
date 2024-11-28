// utils/token.utils.ts
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../env";

interface TokenUser {
  name: string;
}

const createToken = (
  user: TokenUser,
  type: "access" | "refresh" = "access"
) => {
  const payload = {
    name: user.name,
  };

  const options = {
    expiresIn: type === "access" ? "1h" : "7d",
  };

  const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;

  return jwt.sign(payload, secret, options);
};

export default createToken;
