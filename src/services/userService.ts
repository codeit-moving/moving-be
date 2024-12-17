import userRepository from "../repositorys/userRepository";
import CustomError from "../utils/interfaces/customError";
import bcrypt from "bcrypt";

interface UpdateUser {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface CustomerResponse {
  customer: {
    id: number;
    imageUrl: string | { imageUrl: string }[];
    services: number[];
    regions: number[];
  };
}

interface MoverResponse {
  mover: {
    id: number;
    imageUrl: string | { imageUrl: string }[];
    services: number[];
    regions: number[];
    nickname: string;
    career: number;
    introduction: string;
    description: string;
  };
}

const updateUser = async (userId: number, updateData: UpdateUser) => {
  const user = await userRepository.findById(userId);
  const isPasswordCorrect = await bcrypt.compare(
    updateData.currentPassword!,
    user!.password!
  );

  if (updateData.newPassword && updateData.currentPassword) {
    if (!isPasswordCorrect) {
      const error: CustomError = new Error("Unauthorized");
      error.status = 401;
      error.data = {
        message: "현재 비밀번호가 일치하지 않습니다.",
      };
      throw error;
    }

    if (updateData.currentPassword === updateData.newPassword) {
      const error: CustomError = new Error("Conflict");
      error.status = 409;
      error.data = {
        message: "기존 비밀번호와 동일합니다.",
      };
      throw error;
    }
  }

  const hashedNewPassword = await bcrypt.hash(updateData.newPassword!, 10);

  const updateUserData = {
    name: updateData.name,
    phoneNumber: updateData.phoneNumber,
    password: hashedNewPassword,
  };

  return await userRepository.updateUser(userId, updateUserData);
};

const getUser = async (userId: number) => {
  const userType = await userRepository.getUserType(userId);
  if (userType === "customer") {
    const response = (await userRepository.getCustomer(
      userId
    )) as CustomerResponse;
    if (
      response?.customer?.imageUrl &&
      Array.isArray(response.customer.imageUrl)
    ) {
      response.customer.imageUrl = response.customer.imageUrl[0].imageUrl;
    }
    return response;
  } else if (userType === "mover") {
    const response = (await userRepository.getMover(userId)) as MoverResponse;
    if (response?.mover?.imageUrl && Array.isArray(response.mover.imageUrl)) {
      response.mover.imageUrl = response.mover.imageUrl[0].imageUrl;
    }
    return response;
  } else {
    throw new Error("User not found");
  }
}; //imageUrl: object 타입으로 반환하지 않고 string 타입으로 1개 반환

export default {
  updateUser,
  getUser,
};
