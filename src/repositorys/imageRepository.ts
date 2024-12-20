import prismaClient from "../utils/prismaClient";

interface UpdateMoverProfile {
  nickname?: string;
  career?: number;
  introduction?: string;
  description?: string;
  services?: number[];
  regions?: number[];
}

interface UpdateCustomerProfile {
  services?: number[];
  regions?: number[];
}

const findInActiveImage = async () => {
  return prismaClient.profileImage.findMany({
    where: {
      status: false,
    },
  });
};

const deleteImage = async (imageUrl: string) => {
  return prismaClient.profileImage.deleteMany({
    where: {
      imageUrl,
    },
  });
};

const updateMoverProfile = async (
  imageUrl: string | undefined,
  userId: number,
  moverId: number,
  profile: UpdateMoverProfile
) => {
  //이미지url 여부에 따라 조건부 트랜잭션 생성
  const imageTransactions = imageUrl
    ? [
        prismaClient.profileImage.updateMany({
          where: {
            moverId,
            status: true,
          },
          data: {
            status: false,
          },
        }),
        prismaClient.profileImage.create({
          data: {
            imageUrl,
            moverId,
            status: true,
          },
        }),
      ]
    : [];

  const profileTransaction = prismaClient.mover.update({
    where: { userId: userId },
    data: profile,
  });

  const transactions = [...imageTransactions, profileTransaction];

  return prismaClient.$transaction(transactions);
};

const updateCustomerProfile = async (
  imageUrl: string | undefined,
  userId: number,
  customerId: number,
  profile: UpdateCustomerProfile
) => {
  //이미지url 여부에 따라 조건부 트랜잭션 생성
  const imageTransactions = imageUrl
    ? [
        prismaClient.profileImage.updateMany({
          where: {
            customerId,
            status: true,
          },
          data: {
            status: false,
          },
        }),
        prismaClient.profileImage.create({
          data: {
            imageUrl,
            customerId,
            status: true,
          },
        }),
      ]
    : [];

  const profileTransaction = prismaClient.customer.update({
    where: { userId: userId },
    data: profile,
  });

  const transactions = [...imageTransactions, profileTransaction];

  return prismaClient.$transaction(transactions);
};

export default {
  updateMoverProfile,
  deleteImage,
  findInActiveImage,
  updateCustomerProfile,
};
