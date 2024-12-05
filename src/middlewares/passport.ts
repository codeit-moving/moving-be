import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as NaverStrategy } from "passport-naver";
import {
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
} from "../env";
import { JWT_SECRET } from "../env";
import oauthService from "../services/oauthService";
import CustomError from "../utils/interfaces/customError";

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["accessToken"];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      if (!jwtPayload) {
        const error: CustomError = new Error("Unauthorized");
        error.status = 401;
        error.data = {
          message: "유효하지 않은 토큰입니다.",
        };
        throw error;
      }
      return done(null, jwtPayload);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "jwt-optional",
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
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
