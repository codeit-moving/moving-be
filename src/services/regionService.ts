import regionRepository from "../repositorys/regionRepository";
import { throwHttpError } from "../utils/constructors/httpError";

const getRegionsAll = async () => {
  const regions = await regionRepository.getRegionAll();
  if (!regions) {
    return throwHttpError(404, "지역 리스트를 찾을 수 없습니다.");
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
