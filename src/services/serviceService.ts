import serviceRepository from "../repositorys/serviceRepository";
import CustomError from "../utils/interfaces/customError";

const getServicesAll = async () => {
  const services = await serviceRepository.getServicesAll();
  if (!services) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "서비스 리스트를 찾을 수 없습니다.",
    };
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
