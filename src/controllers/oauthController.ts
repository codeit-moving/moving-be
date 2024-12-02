import { Router } from "express";
import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import {
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
} from "../env";
import oauthService from "../services/oauthService";
import cookieConfig from "../config/cookie.config";
import createToken from "../utils/token.utils";

const router = Router();

passport.use(
  new NaverStrategy(
    {
      clientID: NAVER_CLIENT_ID!,
      clientSecret: NAVER_CLIENT_SECRET!,
      callbackURL: NAVER_REDIRECT_URI!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const result = await oauthService.naver(profile);
        return done(null, result);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

router.get(
  "/naver",
  passport.authenticate("naver", {
    scope: ["email"],
    prompt: "consent",
  })
);

router.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    const user = req.user as any;

    const accessToken = createToken(user, "access");
    const refreshToken = createToken(user, "refresh");

    res.cookie("accessToken", accessToken, cookieConfig.accessTokenOption);
    res.cookie("refreshToken", refreshToken, cookieConfig.refreshTokenOption);

    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

export default router;
