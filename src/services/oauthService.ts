import passport from "passport";
import authRepository from "../repositorys/authRepository";

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

const naver = async (profile: any) => {
  try {
    const existingUser = await authRepository.findByEmail(
      profile.emails?.[0].value
    );

    if (existingUser) {
      return existingUser;
    }

    const newUser = await authRepository.createUser({
      email: profile.emails?.[0].value!,
      name: "Unknown",
      phoneNumber: "Unknown",
      password: null,
      isOAuth: true,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};
export default { naver };
