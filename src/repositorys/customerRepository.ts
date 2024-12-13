import prismaClient from "../utils/prismaClient";

interface Profile {
  userId: number;
  imageUrl: string;
  services: number[];
  regions: number[];
}

interface UpdateProfile {
  services?: number[];
  regions?: number[];
}

const createCustomerProfile = (profile: Profile) => {
  return prismaClient.customer.create({
    data: { ...profile, imageUrl: { create: { imageUrl: profile.imageUrl } } },
  });
};

const updateCustomerProfile = async (
  userId: number,
  profile: UpdateProfile
) => {
  return prismaClient.customer.update({
    where: { userId: userId },
    data: {
      services: profile.services,
      regions: profile.regions,
    },
  });
};

export default { createCustomerProfile, updateCustomerProfile };
