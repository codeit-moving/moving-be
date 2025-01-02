import customerRepository from "../repositorys/customerRepository";
import imageRepository from "../repositorys/imageRepository";
import { throwHttpError } from "../utils/constructors/httpError";
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

//고객 프로필 생성
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

//고객 프로필 업데이트
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
      return throwHttpError(500, "이미지 업로드 실패");
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
    return throwHttpError(500, "프로필 업데이트 실패");
  }
};

export default { createCustomerProfile, updateCustomerProfile };
