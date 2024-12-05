import passport from "passport";
import userRepository from "../repositorys/userRepository";

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

const naver = async (profile: any) => {
  try {
    const existingUser = await userRepository.findByEmail(
      profile.emails?.[0].value
    );

    if (existingUser) {
      return existingUser;
    }

    const newUser = await userRepository.createUser({
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
