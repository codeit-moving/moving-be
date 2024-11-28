import regionRepository from "../repositorys/regionRepository";
import CustomError from "../utils/interfaces/customError";

const getRegionsAll = async () => {
  const regions = await regionRepository.getRegionAll();
  if (!regions) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "지역 리스트를 찾을 수 없습니다.",
    };
  }
  const response = regions.reduce((acc: { [key: string]: number }, region) => {
    acc[region.value] = region.code;
    return acc;
  }, {});
  return response;
};

export default {
  getRegionsAll,
};
