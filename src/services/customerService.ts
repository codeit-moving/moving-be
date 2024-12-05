import customerRepository from "../repositorys/customerRepository";

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

const createCustomerProfile = async (profile: Profile) => {
  return customerRepository.createCustomerProfile(profile);
};

const updateCustomerProfile = async (
  userId: number,
  profile: UpdateProfile
) => {
  return customerRepository.updateCustomerProfile(userId, profile);
};

export default { createCustomerProfile, updateCustomerProfile };
