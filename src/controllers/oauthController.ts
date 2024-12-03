import { Router } from "express";
import passport from "passport";
import cookieConfig from "../config/cookie.config";
import createToken from "../utils/token.utils";

const router = Router();

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
