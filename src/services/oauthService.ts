import passport from "passport";
import userRepository from "../repositorys/userRepository";

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

const naver = async (profile: any, userType: string) => {
  try {
    const existingUser = await userRepository.findByEmail(profile._json.email);

    if (existingUser) {
      return existingUser;
    }

    const newUser = await userRepository.createUser(
      {
        email: profile._json.email,
        name: profile._json.nickname || "Unknown",
        phoneNumber: null,
        password: null,
        isOAuth: true,
      },
      userType
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

const kakao = async (profile: any, userType: string) => {
  try {
    const existingUser = await userRepository.findByEmail(
      profile._json.kakao_account.email
    );

    if (existingUser) {
      return existingUser;
    }

    const newUser = await userRepository.createUser(
      {
        email: profile._json.kakao_account.email,
        name: profile._json.properties.nickname || "Unknown",
        phoneNumber: null,
        password: null,
        isOAuth: true,
      },
      userType
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

const google = async (profile: any, userType: string) => {
  try {
    const existingUser = await userRepository.findByEmail(profile._json.email);

    if (existingUser) {
      return existingUser;
    }

    const newUser = await userRepository.createUser(
      {
        email: profile._json.email,
        name: profile._json.name || "Unknown",
        phoneNumber: null,
        password: null,
        isOAuth: true,
      },
      userType
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

export default { naver, kakao, google };
