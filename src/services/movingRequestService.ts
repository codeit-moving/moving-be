import movingRequestRepository from "../repositorys/movingRequestRepository";
import { MovingRequestData } from "../utils/interfaces/movingRequest/movingRequest";
import CustomError from "../utils/interfaces/customError";
import quoteRepository from "../repositorys/quoteRepository";
import getRatingsByMoverIds from "../utils/mover/getRatingsByMover";
import processMoverData from "../utils/mover/processMoverData";
import processQuotes from "../utils/quote/processQuoteData";

interface queryString {
  limit: number;
  isCompleted: boolean;
  cursor: number | null;
}

interface OffsetQueryString {
  pageSize: number;
  pageNum: number;
}

//이사요청 목록 조회
const getMovingRequestList = async (customerId: number, query: queryString) => {
  const { limit, isCompleted, cursor } = query;

  const movingRequestList = await movingRequestRepository.getMovingRequestList(
    customerId,
    { limit, isCompleted, cursor }
  );

  if (!movingRequestList) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "Not Found";
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
      ...rest,
      requestDate: createAt,
      isConfirmed: Boolean(confirmedQuote), //완료된 견적서와 관계가 있다면 true
      // name: customer.user.name,
      // isDesignated: _count.mover > 0, //관계가 있다면 true
    };
  });

  return {
    nextCursor,
    hasNext,
    list: resMovingRequestList.slice(0, limit),
  };
};

const getMovingRequestListByCustomer = async (
  customerId: number,
  query: OffsetQueryString
) => {
  const { pageSize, pageNum } = query;

  const movingRequestListPromise =
    movingRequestRepository.getMovingRequestListByCustomer(customerId, {
      pageSize,
      pageNum,
    });
  const totalCountPromise =
    movingRequestRepository.getMovingRequestCountByCustomer(customerId);

  const [movingRequestList, totalCount] = await Promise.all([
    movingRequestListPromise,
    totalCountPromise,
  ]);

  if (!movingRequestList.length) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "조건의 맞는 이사요청 목록이 없습니다.",
    };
    throw error;
  }

  const resMovingRequestList = movingRequestList.map((movingRequest) => {
    const { customer, createAt, confirmedQuote, ...rest } = movingRequest;

    return {
      ...rest,
      name: customer.user.name,
      requestDate: createAt,
      isConfirmed: Boolean(confirmedQuote), //완료된 견적서와 관계가 있다면 true
    };
  });

  const totalPage = Math.ceil(totalCount / pageSize);

  return {
    currentPage: pageNum,
    pageSize,
    totalPage,
    totalCount,
    list: resMovingRequestList,
  };
};

//이사요청의 견적서 조회
const getQuoteByMovingRequestId = async (
  customerId: number,
  movingRequestId: number,
  isCompleted: boolean
) => {
  const quotes = await quoteRepository.getQuoteByMovingRequestId(
    movingRequestId,
    isCompleted
  );

  const processedQuotes = await processQuotes(customerId, quotes);

  return {
    movingRequestId,
    list: processedQuotes,
  };
};

//대기중인 견적서 조회
const getPendingQuotes = async (customerId: number) => {
  const activeRequest = await movingRequestRepository.getActiveRequest(
    customerId
  );

  if (!activeRequest) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "활성중인 이사요청이 없습니다.",
    };
    throw error;
  }

  const quoteCount = await quoteRepository.getQuoteCountByMovingRequestId(
    activeRequest.id
  );

  const quotes = quoteRepository.getQuoteByMovingRequestId(activeRequest.id);

  const [promiseQuotes, promiseQuoteCount] = await Promise.all([
    quotes,
    quoteCount,
  ]);

  const processedQuotes = await processQuotes(customerId, promiseQuotes);

  return {
    totalCount: promiseQuoteCount,
    list: processedQuotes,
  };
};

//이사요청 생성
const createMovingRequest = async (
  customerId: number,
  requestData: MovingRequestData
) => {
  const activeRequest = await movingRequestRepository.getActiveRequest(
    customerId
  );

  if (activeRequest) {
    const error: CustomError = new Error("Bad Request");
    error.status = 400;
    error.data = {
      message: "활성중인 이사요청이 있습니다.",
    };
    throw error;
  }

  const movingRequest = await movingRequestRepository.createMovingRequest(
    customerId,
    requestData
  );

  return movingRequest;
};

//이사요청 지정
const designateMover = async (
  movingRequestId: number,
  moverId: number,
  customerId: number
) => {
  //지정 가능 인원 조회
  const designateCountPromise =
    movingRequestRepository.getDesignateCount(movingRequestId);

  const activeRequestPromise =
    movingRequestRepository.getActiveRequest(customerId);

  const [result, activeRequest] = await Promise.all([
    designateCountPromise,
    activeRequestPromise,
  ]);

  if (activeRequest) {
    const error: CustomError = new Error("Bad Request");
    error.status = 400;
    error.data = {
      message: "일반 견적 요청을 먼저 진행해 주세요.",
    };
    throw error;
  }

  //지정 가능 인원 초과 체크
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
  getQuoteByMovingRequestId,
  getPendingQuotes,
  getMovingRequestListByCustomer,
};
