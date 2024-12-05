import userRepository from "../repositorys/userRepository";
import CustomError from "../utils/interfaces/customError";

interface UpdateUser {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

const updateUser = async (userId: number, updateData: UpdateUser) => {
  const user = await userRepository.findById(userId);
  if (updateData.newPassword && updateData.currentPassword) {
    if (user!.password !== updateData.currentPassword) {
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

  const updateUserData = {
    name: updateData.name,
    phoneNumber: updateData.phoneNumber,
    password: updateData.newPassword,
  };

  return await userRepository.updateUser(userId, updateUserData);
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

export default { updateUser, getUser };
