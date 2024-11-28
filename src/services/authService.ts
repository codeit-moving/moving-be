import bcrypt from "bcrypt";
import authRepository from "../repositorys/authRepository";
import CustomError from "../utils/interfaces/customError";
import prismaClient from "../utils/prismaClient";

interface SignInData {
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
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
  const user = await authRepository.findByEmail(email);

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
  const { name, email, password, phoneNumber, imageUrl, services, regions } =
    customer;

  try {
    const existingUser = await authRepository.existingUser(email, phoneNumber);

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

    const result = await prismaClient.$transaction(async (tx) => {
      const user = await authRepository.createUser(tx, {
        name,
        email,
        password,
        phoneNumber,
      });
      const customer = await authRepository.createCustomer(tx, {
        userId: user.id,
        imageUrl,
        services,
        regions,
      });

      return { user, customer };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const signUpMover = async (mover: SignUpMover) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    imageUrl,
    services,
    regions,
    nickname,
    career,
    introduction,
    description,
  } = mover;

  try {
    const existingUser = await authRepository.existingUser(email, phoneNumber);

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

    const result = await prismaClient.$transaction(async (tx) => {
      const user = await authRepository.createUser(tx, {
        name,
        email,
        password,
        phoneNumber,
      });
      const mover = await authRepository.createMover(tx, {
        userId: user.id,
        imageUrl,
        services,
        regions,
        nickname,
        career,
        introduction,
        description,
      });

      console.log(mover);

      return { user, mover };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export default { signIn, signUpCustomer, signUpMover };
