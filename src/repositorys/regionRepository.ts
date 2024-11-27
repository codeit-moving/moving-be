import prismaClient from "../utils/prismaClient";

const getRegionAll = async () => {
  return prismaClient.region.findMany({
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
  getRegionAll,
};
