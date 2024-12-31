import bcrypt from "bcrypt";
import userRepository from "../repositorys/userRepository";
import CustomError from "../utils/interfaces/customError";
import { uploadFile } from "../utils/s3.utils";
import { throwHttpError } from "../utils/constructors/httpError";

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
  imageUrl: Express.Multer.File;
  services: number[];
  regions: number[];
}

interface SignUpMover extends User {
  nickname: string;
  career: number;
  introduction: string;
  description: string;
  imageUrl: Express.Multer.File;
  services: number[];
  regions: number[];
}

const signIn = async ({ email, password }: SignInData) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return throwHttpError(404, "이메일로 등록된 사용자가 없습니다.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!); //패스워드 검증

  if (!isPasswordValid) {
    return throwHttpError(401, "비밀번호가 일치하지 않습니다.");
  }

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword };
};

const signUpCustomer = async (customer: SignUpCustomer) => {
  const { email, phoneNumber } = customer;
  const imageUrl = await uploadFile(customer.imageUrl);

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

    const hashedPassword = await bcrypt.hash(customer.password, 10);

    const customerData = {
      ...customer,
      imageUrl,
      password: hashedPassword,
    };

    const result = await userRepository.createCustomer(customerData);

    return result;
  } catch (error) {
    throw error;
  }
};

const signUpMover = async (mover: SignUpMover) => {
  const { email, phoneNumber } = mover;
  const imageUrl = await uploadFile(mover.imageUrl);

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

    const hashedPassword = await bcrypt.hash(mover.password, 10);

    const moverData = {
      ...mover,
      imageUrl,
      password: hashedPassword,
    };
    const result = await userRepository.createMover(moverData);

    return result;
  } catch (error) {
    throw error;
  }
};

const validate = async (email: string, phoneNumber: string) => {
  const user = await userRepository.existingUser(email, phoneNumber);

  if (user) {
    const error: CustomError = new Error("Conflict");
    if (user.email === email) {
      error.status = 409;
      error.data = {
        message: "이미 존재하는 이메일입니다.",
      };
      throw error;
    }
    if (user.phoneNumber === phoneNumber) {
      error.status = 409;
      error.data = {
        message: "이미 존재하는 전화번호입니다.",
      };
      throw error;
    }
  }

  return user;
};

const validatePassword = async (userId: number, password: string) => {
  const findPassword = await userRepository.findPassword(userId);
  const decodedPassword = await bcrypt.compare(
    password,
    findPassword?.password!
  );
  if (!findPassword) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "사용자가 존재하지 않습니다.",
    };
    throw error;
  }

  if (!decodedPassword) {
    const error: CustomError = new Error("Invalid password");
    error.status = 401;
    error.data = {
      message: "비밀번호가 일치하지 않습니다.",
    };
    throw error;
  }
};

export default {
  signIn,
  signUpCustomer,
  signUpMover,
  validate,
  validatePassword,
};
