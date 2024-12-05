import bcrypt from "bcrypt";
import userRepository from "../repositorys/userRepository";
import CustomError from "../utils/interfaces/customError";

interface SignInData {
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

const signIn = async ({ email, password }: SignInData) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "이메일로 등록된 사용자가 없습니다.",
      email,
    };
    throw error;
  }

  // const isPasswordValid = await bcrypt.compare(password, user.password!);

  const isPasswordValid = password === user.password;

  if (!isPasswordValid) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "비밀번호가 일치하지 않습니다.",
    };
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword };
};

const signUpCustomer = async (customer: SignUpCustomer) => {
  const { email, phoneNumber } = customer;

  try {
    const existingUser = await userRepository.existingUser(email, phoneNumber);

    if (existingUser) {
      const error: CustomError = new Error("Conflict");
      if (existingUser.email === email) {
        error.status = 409;
        error.data = {
          message: "이미 존재하는 이메일입니다.",
        };
        throw error;
      }
      if (existingUser.phoneNumber === phoneNumber) {
        error.status = 409;
        error.data = {
          message: "이미 존재하는 전화번호입니다.",
        };
        throw error;
      }
    }

    const result = await userRepository.createCustomer(customer);

    return result;
  } catch (error) {
    throw error;
  }
};

const signUpMover = async (mover: SignUpMover) => {
  const { email, phoneNumber } = mover;

  try {
    const existingUser = await userRepository.existingUser(email, phoneNumber);

    if (existingUser) {
      const error: CustomError = new Error("Conflict");
      if (existingUser.email === email) {
        error.status = 409;
        error.data = {
          message: "이미 존재하는 이메일입니다.",
        };
        throw error;
      }
      if (existingUser.phoneNumber === phoneNumber) {
        error.status = 409;
        error.data = {
          message: "이미 존재하는 전화번호입니다.",
        };
        throw error;
      }
    }

    const result = await userRepository.createMover(mover);

    return result;
  } catch (error) {
    throw error;
  }
};

const getUser = async (userId: number) => {
  const userType = await userRepository.getUserType(userId);
  if (userType === "customer") {
    return await userRepository.getCustomer(userId);
  } else if (userType === "mover") {
    return await userRepository.getMover(userId);
  } else {
    throw new Error("User not found");
  }
};

export default { signIn, signUpCustomer, signUpMover, getUser };
