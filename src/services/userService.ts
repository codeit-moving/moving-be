import { DEFAULT_PROFILE_IMAGE } from "../env";
import userRepository from "../repositorys/userRepository";
import { throwHttpError } from "../utils/constructors/httpError";
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

  if (updateData.newPassword || updateData.currentPassword) {
    //새로운 비밀번호, 현재 비밀번호가 존재하면 일단 로직 수행
    if (!updateData.newPassword || !updateData.currentPassword) {
      //그런데 둘 중 하나라도 없으면 에러 발생
      return throwHttpError(
        400,
        "비밀번호 변경을 위해서는 현재 비밀번호와 새로운 비밀번호가 모두 필요합니다."
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      updateData.currentPassword,
      user!.password!
    );

    if (!isPasswordCorrect) {
      return throwHttpError(401, "현재 비밀번호가 일치하지 않습니다.");
    }

    if (updateData.currentPassword === updateData.newPassword) {
      return throwHttpError(409, "기존 비밀번호와 동일합니다.");
    }
  }

  const updateUserData: {
    name?: string;
    phoneNumber?: string;
    password?: string;
  } = {};

  if (updateData.name) updateUserData.name = updateData.name;
  if (updateData.phoneNumber)
    updateUserData.phoneNumber = updateData.phoneNumber;
  if (updateData.newPassword) {
    updateUserData.password = await bcrypt.hash(updateData.newPassword, 10);
  }

  return await userRepository.updateUser(userId, updateUserData);
};

const getUser = async (userId: number) => {
  const user = await userRepository.getUser(userId);

  if (user === "customer") {
    const response = (await userRepository.getCustomer(
      userId
    )) as CustomerResponse;
    if (!response?.customer?.imageUrl) {
      response.customer.imageUrl = DEFAULT_PROFILE_IMAGE;
    } else if (Array.isArray(response.customer.imageUrl)) {
      response.customer.imageUrl =
        response.customer.imageUrl[0]?.imageUrl || DEFAULT_PROFILE_IMAGE;
    }
    return response;
  } else if (user === "mover") {
    const response = (await userRepository.getMover(userId)) as MoverResponse;
    if (!response?.mover?.imageUrl) {
      response.mover.imageUrl = DEFAULT_PROFILE_IMAGE;
    } else if (Array.isArray(response.mover.imageUrl)) {
      response.mover.imageUrl =
        response.mover.imageUrl[0]?.imageUrl || DEFAULT_PROFILE_IMAGE;
    }
    return response;
  } else if (user) {
    return user;
  } else {
    return throwHttpError(404, "사용자가 존재하지 않습니다.");
  }
}; //imageUrl: object 타입으로 반환하지 않고 string 타입으로 1개 반환

const getUserById = async (userId: number) => {
  const user = await userRepository.findByUserId(userId);
  if (!user) {
    return throwHttpError(404, "사용자가 존재하지 않습니다.");
  }
  return user;
};

export default {
  updateUser,
  getUser,
  getUserById,
};
