import customerRepository from "../repositorys/customerRepository";
import imageRepository from "../repositorys/imageRepository";
import CustomError from "../utils/interfaces/customError";
import { uploadFile } from "../utils/s3.utils";

interface Profile {
  userId: number;
  imageUrl: Express.Multer.File;
  services: number[];
  regions: number[];
}

interface UpdateProfile {
  imageUrl?: Express.Multer.File;
  services?: number[];
  regions?: number[];
  key?: string;
}

const createCustomerProfile = async (profile: Profile) => {
  const imageUrl = await uploadFile(profile.imageUrl);
  const customerProfile = {
    userId: profile.userId,
    imageUrl,
    services: profile.services,
    regions: profile.regions,
  };
  return customerRepository.createCustomerProfile(customerProfile);
};

const updateCustomerProfile = async (
  userId: number,
  customerId: number,
  profile: UpdateProfile
) => {
  const { imageUrl, ...rest } = profile;
  let uploadedImageUrl;

  if (imageUrl) {
    try {
      uploadedImageUrl = await uploadFile(imageUrl);
    } catch (e) {
      const error: CustomError = new Error("Internal Server Error");
      error.status = 500;
      error.data = {
        message: "이미지 업로드 실패",
      };
      throw error;
    }
  }

  try {
    return await imageRepository.updateCustomerProfile(
      uploadedImageUrl,
      userId,
      customerId,
      rest
    );
  } catch (e) {
    const error: CustomError = new Error("Internal Server Error");
    error.status = 500;
    error.data = {
      message: "프로필 업데이트 실패",
    };
    throw error;
  }
};

export default { createCustomerProfile, updateCustomerProfile };
