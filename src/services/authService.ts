import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { postAuthSigninRepository } from "../repositorys/authRepository";
import { JWT_SECRET, REFRESH_SECRET } from "../env";

interface SignInServiceInput {
  email: string;
  password: string;
}

const postAuthSigninService = async ({
  email,
  password,
}: SignInServiceInput) => {
  const user = await postAuthSigninRepository({ email });

  if (!user) {
    throw new Error("Invalid email");
  }

  // const isPasswordValid = await bcrypt.compare(password, user.password!);
  const isPasswordValid = password === user.password;

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken, user: userWithoutPassword };
};

export { postAuthSigninService };
