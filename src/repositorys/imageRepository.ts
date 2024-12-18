import prismaClient from "../utils/prismaClient";

const createImage = async (customerId: number, imageUrl: string) => {
  return prismaClient.profileImage.create({
    data: {
      imageUrl,
      customerId,
      status: true,
    },
  }); //새로운 이미지 활성화
};

const deactivateImage = async (customerId: number) => {
  return prismaClient.profileImage.updateMany({
    where: {
      customerId,
      status: true,
    },
    data: {
      status: false,
    },
  });
}; //기존 이미지 비활성화

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

export default { createImage, deactivateImage, deleteImage, findInActiveImage };
