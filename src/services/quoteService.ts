// 필요한 모듈들을 가져옵니다.
import quoteRepository from "../repositorys/quoteRepository";
import customError from "../utils/interfaces/customError";
import processQuotes from "../utils/quote/processQuoteData";
import movingRequestRepository from "../repositorys/movingRequestRepository";
import moverRepository from "../repositorys/moverRepository";

// 특정 견적서를 아이디로 가져오는 함수입니다.
const getQuoteById = async (customerId: number, quoteId: number) => {
  // 견적서를 데이터베이스에서 가져옵니다.
  const quote = await quoteRepository.getQuoteById(quoteId);

  // 만약 견적서를 찾지 못하면 에러를 발생시킵니다.
  if (!quote) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.message = "Not Found";
    error.data = {
      message: "견적서를 찾을 수 없습니다.",
    };
    throw error;
  }

  // 견적서 데이터를 가공합니다.
  const processedQuote = await processQuotes(customerId, quote);

  // 가공된 견적서를 반환합니다.
  return processedQuote;
};

// (받은 요청) 견적서를 보내는 함수입니다.
const createQuote = async (
  movingRequestId: number,
  moverId: number,
  cost: number,
  comment: string
) => {
  // 이사 요청이 존재하는지 확인
  const movingRequest = await movingRequestRepository.getMovingRequestById(
    movingRequestId
  );
  if (!movingRequest) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.message = "Not Found";
    error.data = {
      message: "존재하지 않는 이사 요청입니다.",
    };
    throw error;
  }

  // 견적서 생성
  const quote = await quoteRepository.createQuoteByMovingRequestId(
    movingRequestId,
    moverId,
    cost,
    comment
  );

  return {
    id: quote.id,
    cost: quote.cost,
    comment: quote.comment,
    service: quote.movingRequest.service,
    pickupAddress: quote.movingRequest.pickupAddress,
    dropOffAddress: quote.movingRequest.dropOffAddress,
    movingDate: quote.movingRequest.movingDate,
    isDesignated: quote.movingRequest.isDesignated,
  };
};

// (기사님이 작성한) 견적서 목록을 조회하는 함수입니다.
const getQuoteList = async (moverId: number) => {
  // moverId 유효성 검사
  if (!moverId) {
    const error: customError = new Error("Bad Request");
    error.status = 400;
    error.message = "Bad Request";
    error.data = {
      message: "기사 ID가 필요합니다.",
    };
    throw error;
  }

  // 견적서 목록을 조회합니다.
  const quotes = await quoteRepository.getQuoteListByMoverId(moverId);

  if (!quotes || quotes.length === 0) {
    return []; // 빈 배열 반환
  }

  // 3. 응답 데이터를 가공하여 반환합니다.
  return quotes.map((quote) => ({
    id: quote.id,
    cost: quote.cost,
    comment: quote.comment,
    service: quote.movingRequest.service,
    customerName: quote.movingRequest.customer.user.name,
    movingDate: quote.movingRequest.movingDate,
    pickupAddress: quote.movingRequest.pickupAddress,
    dropOffAddress: quote.movingRequest.dropOffAddress,
    isDesignated: quote.movingRequest.isDesignated,
    isConfirmed: !!quote.confirmedQuote,
  }));
};

// (기사님이 작성한) 견적서 상세 정보를 조회하는 함수입니다.
const getQuoteDetail = async (
  moverId: number,
  quoteId: number,
  cost: number
) => {
  // 1. 견적서가 존재하는지 확인합니다.
  const quote = await quoteRepository.getQuoteDetailByMoverId(
    moverId,
    quoteId,
    cost
  );

  if (!quote) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.message = "Not Found";
    error.data = {
      message: "��적서를 찾을 수 없습니다.",
    };
    throw error;
  }

  // 2. 응답 데이터를 가공하여 반환합니다.
  return {
    id: quote.id,
    cost: quote.cost,
    comment: quote.comment,
    service: quote.movingRequest.service,
    customerName: quote.movingRequest.customer.user.name,
    movingDate: quote.movingRequest.movingDate,
    pickupAddress: quote.movingRequest.pickupAddress,
    dropOffAddress: quote.movingRequest.dropOffAddress,
    isDesignated: quote.movingRequest.isDesignated,
  };
};

// 이 모듈에서 제공하는 함수들을 내보냅니다.
export default {
  getQuoteById, // 견적서 아이디로 견적서를 가져오는 함수
  createQuote, // 견적서를 생성하는 함수
  getQuoteList, // 견적서 목록을 가져오는 함수
  getQuoteDetail, // 견적서 상세 정보를 가져오는 함수
};
