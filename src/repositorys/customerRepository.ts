import prismaClient from "../utils/prismaClient";

interface Profile {
  userId: number;
  imageUrl: string;
  services: number[];
  regions: number[];
}

interface UpdateProfile {
  imageUrl?: string;
  services?: number[];
  regions?: number[];
}

const createCustomerProfile = (profile: Profile) => {
  return prismaClient.customer.create({
    data: profile,
  });
};

const updateCustomerProfile = (userId: number, filteredData: UpdateProfile) => {
  return prismaClient.customer.update({
    where: { userId: userId },
    data: filteredData,
  });
};

export default { createCustomerProfile, updateCustomerProfile };
