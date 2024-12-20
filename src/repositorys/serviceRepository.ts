import prismaClient from "../utils/prismaClient";

const getServicesAll = async () => {
  return prismaClient.service.findMany({
    where: {
      status: true,
    },
    select: {
      code: true,
      value: true,
    },
  });
};

export default {
  getServicesAll,
};
