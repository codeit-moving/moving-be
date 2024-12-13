import customerRepository from "../repositorys/customerRepository";
import imageRepository from "../repositorys/imageRepository";
import prismaClient from "../utils/prismaClient";
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
  profile: UpdateProfile
) => {
  return prismaClient.$transaction(async () => {
    const customer = await customerRepository.updateCustomerProfile(userId, {
      services: profile.services,
      regions: profile.regions,
    });

    if (profile.imageUrl) {
      const uploadImage = await uploadFile(profile.imageUrl);
      await imageRepository.deactivateImage(customer.id);
      await imageRepository.createImage(customer.id, uploadImage);
    }

    return customer;
  });
};

export default { createCustomerProfile, updateCustomerProfile };
