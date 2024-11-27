import { Request, RequestHandler, Response, Router } from "express";
import { postAuthSigninService } from "../services/authService";

const router = Router();

interface SignInRequestBody {
  email: string;
  password: string;
}

const postAuthSignin: RequestHandler = async (req: Request, res: Response) => {
  const { email, password }: SignInRequestBody = req.body;
  const { user, accessToken, refreshToken } = await postAuthSigninService({
    email,
    password,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
    domain: "localhost",
    path: "/",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: "localhost",
    path: "/",
  });
  res.status(200).json({ message: "로그인 성공", user });
};

router.post("/signin", postAuthSignin);

export default router;
