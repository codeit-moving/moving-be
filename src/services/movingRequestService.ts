import movingRequestRepository from "../repositorys/movingRequestRepository";
import { MovingRequestData } from "../utils/interfaces/movingRequest/movingRequest";
import CustomError from "../utils/interfaces/customError";

interface queryString {
  limit: number;
  isCompleted: boolean;
  cursor: number | null;
}

const getMovingRequestList = async (customerId: number, query: queryString) => {
  const { limit, isCompleted, cursor } = query;

  const movingRequestList = await movingRequestRepository.getMovingRequestList(
    customerId,
    { limit, isCompleted, cursor }
  );

  if (!movingRequestList) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "이사요청 목록이 없습니다.",
    };
    throw error;
  }

  //커서 설정
  const nextCursor =
    movingRequestList.length > limit ? movingRequestList[limit - 1].id : "";
  const hasNext = Boolean(nextCursor); //다음 페이지가 있는지 여부

  //데이터 가공
  const resMovingRequestList = movingRequestList.map((movingRequest) => {
    const { _count, customer, createAt, confirmedQuote, ...rest } =
      movingRequest;

    return {
      name: customer.user.name,
      requestDate: createAt,
      isDesignated: _count.mover > 0, //관계가 있다면 true
      isConfirmed: Boolean(confirmedQuote), //견적서가 있다면 true
      ...rest,
    };
  });

  return {
    nextCursor,
    hasNext,
    list: resMovingRequestList.slice(0, limit),
  };
};

const createMovingRequest = async (
  customerId: number,
  requestData: MovingRequestData
) => {
  const movingRequest = await movingRequestRepository.createMovingRequest(
    customerId,
    requestData
  );

  return movingRequest;
};

//이사요청 지정
const designateMover = async (movingRequestId: number, moverId: number) => {
  //지정 가능 인원 조회
  const result = await movingRequestRepository.getDesignateCount(
    movingRequestId
  );

  if (!result || result._count.mover >= 3) {
    const error: CustomError = new Error("Bad Request");
    error.status = 400;
    error.data = {
      message: "지정 요청 가능한 인원이 초과되었습니다. (최대 3명)",
    };
    throw error;
  }

  //이사요청 지정
  const movingRequest = await movingRequestRepository.updateDesignated(
    movingRequestId,
    moverId
  );

  //남은 지정요청 수 조회
  const designateRemain = 3 - movingRequest._count.mover;
  return designateRemain;
};

//이사요청 지정 취소
const cancelDesignateMover = async (
  movingRequestId: number,
  moverId: number
) => {
  //이사요청 지정 취소
  const movingRequest = await movingRequestRepository.updateDesignatedCancel(
    movingRequestId,
    moverId
  );

  //남은 지정요청 수 조회
  const designateRemain = 3 - movingRequest._count.mover;
  return designateRemain;
};

export default {
  getMovingRequestList,
  createMovingRequest,
  designateMover,
  cancelDesignateMover,
};
