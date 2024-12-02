import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { JWT_SECRET } from "../env";

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
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
