import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import {
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
} from "../env";
import { JWT_SECRET } from "../env";
import oauthService from "../services/oauthService";
import CustomError from "../utils/interfaces/customError";
import { Strategy } from "passport-custom";
import jwt from "jsonwebtoken";

passport.use(
  "jwt",
  new Strategy(async (req, done) => {
    try {
      const token = req.cookies["accessToken"];

      if (!token) {
        const error: CustomError = new Error("Unauthorized");
        error.status = 401;
        error.data = {
          message: "토큰이 존재하지 않습니다.",
        };
        return done(error, false);
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return done(null, decoded);
      } catch (jwtError) {
        const error: CustomError = new Error("Unauthorized");
        error.status = 401;
        error.data = {
          message: "유효하지 않은 토큰입니다.",
        };
        return done(error, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "jwt-optional",
  new Strategy(async (req, done) => {
    const token = req.cookies["accessToken"];
    if (!token) {
      return done(null, null);
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return done(null, decoded);
    } catch (error) {
      return done(null, null);
    }
  })
);

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

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
