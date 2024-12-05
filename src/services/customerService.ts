import customerRepository from "../repositorys/customerRepository";

interface Profile {
  userId: number;
  imageUrl: string;
  services: number[];
  regions: number[];
}

interface UpdateProfile {
  imageUrl: string | null;
  services: number[] | null;
  regions: number[] | null;
}

const createCustomerProfile = async (profile: Profile) => {
  return customerRepository.createCustomerProfile(profile);
};

const updateCustomerProfile = async (
  userId: number,
  profile: UpdateProfile
) => {
  const filteredData = Object.fromEntries(
    Object.entries(profile).filter(([_, value]) => value !== null)
  );

  return customerRepository.updateCustomerProfile(userId, filteredData);
};

export default { createCustomerProfile, updateCustomerProfile };
