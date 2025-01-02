import customerRepository from "../repositorys/customerRepository";
import imageRepository from "../repositorys/imageRepository";
import { throwHttpError } from "../utils/constructors/httpError";

interface Profile {
  userId: number;
  imageUrl: string[];
  services: number[];
  regions: number[];
}

interface UpdateProfile {
  imageUrl?: string[];
  services?: number[];
  regions?: number[];
  key?: string;
}

//고객 프로필 생성
const createCustomerProfile = async (profile: Profile) => {
  const customerProfile = {
    ...profile,
    imageUrl: profile.imageUrl[0],
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
  try {
    return await imageRepository.updateCustomerProfile(
      imageUrl ? imageUrl[0] : undefined,
      userId,
      customerId,
      rest
    );
  } catch (e) {
    return throwHttpError(500, "프로필 업데이트 실패");
  }
};

export default { createCustomerProfile, updateCustomerProfile };
