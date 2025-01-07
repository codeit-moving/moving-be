import serviceRepository from "../repositorys/serviceRepository";
import { throwHttpError } from "../utils/constructors/httpError";

const getServicesAll = async () => {
  const services = await serviceRepository.getServicesAll();
  if (!services) {
    return throwHttpError(404, "서비스 리스트를 찾을 수 없습니다.");
  }
  const response = services.reduce(
    (acc: { [key: string]: number }, service) => {
      acc[service.value] = service.code;
      return acc;
    },
    {}
  );
  return response;
};

export default {
  getServicesAll,
};
