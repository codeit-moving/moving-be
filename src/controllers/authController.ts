import { Router } from "express";
import authService from "../services/authService";
import { asyncHandle } from "../utils/asyncHandler";
import cookieConfig from "../config/cookie.config";
import createToken from "../utils/token.utils";
import passport from "passport";

const router = Router();

interface SignInRequestBody {
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  isOAuth: boolean;
}

interface SignUpCustomer extends User {
  imageUrl: string;
  services: number[];
  regions: number[];
}

interface SignUpMover extends User {
  nickname: string;
  career: number;
  introduction: string;
  description: string;
  imageUrl: string;
  services: number[];
  regions: number[];
}

router.post(
  "/signin",
  asyncHandle(async (req, res, next) => {
    try {
      const { email, password }: SignInRequestBody = req.body;
      const { user } = await authService.signIn({
        email,
        password,
      });
      if (user) {
        const accessToken = createToken(user, "access");
        const refreshToken = createToken(user, "refresh");
        res.cookie("accessToken", accessToken, cookieConfig.accessTokenOption);
        res.cookie(
          "refreshToken",
          refreshToken,
          cookieConfig.refreshTokenOption
        );
        res.status(204);
      } else {
        return res.status(400).send({ message: "로그인에 실패하였습니다." });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post("/signout", (_, res) => {
  res.clearCookie("accessToken", cookieConfig.clearCookieOption);
  res.clearCookie("refreshToken", cookieConfig.clearCookieOption);
  res.status(204);
});

router.post(
  "/signup/customer",
  asyncHandle(async (req, res, next) => {
    try {
      const SignUpCustomer: SignUpCustomer = req.body;
      await authService.signUpCustomer(SignUpCustomer);
      res.status(204);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/signup/mover",
  asyncHandle(async (req, res, next) => {
    try {
      const SignUpMover: SignUpMover = req.body;
      await authService.signUpMover(SignUpMover);
      res.status(204);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const userId = (req.user as any).id;
      const user = await authService.getUser(userId);
      res.status(200).send({ user });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
