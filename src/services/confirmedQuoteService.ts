import confirmedQuoteRepository from "../repositorys/confirmedQuoteRepository";
import movingRequestRepository from "../repositorys/movingRequestRepository";
import quoteRepository from "../repositorys/quoteRepository";
import customError from "../utils/interfaces/customError";

interface ConfirmedQuote {
  quoteId: number;
  customerId: number;
}

const createConfirmedQuote = async (confirmedQuoteData: ConfirmedQuote) => {
  const activeMovingRequestPromise = movingRequestRepository.getActiveRequest(
    confirmedQuoteData.customerId
  );

  const quotePromise = quoteRepository.getQuoteById(confirmedQuoteData.quoteId);

  const [activeMovingRequest, quote] = await Promise.all([
    activeMovingRequestPromise,
    quotePromise,
  ]);

  if (!activeMovingRequest) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "활동중인 이사요청이 없습니다.",
    };
    throw error;
  }

  if (!quote) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "견적서를 찾을 수 없습니다.",
    };
    throw error;
  }

  const confirmedQuote = await confirmedQuoteRepository.CreateConfirmedQuote({
    movingRequestId: activeMovingRequest.id,
    quoteId: quote.id,
    customerId: confirmedQuoteData.customerId,
    moverId: quote.mover.id,
  });

  return confirmedQuote;
};

export default {
  createConfirmedQuote,
};
