import quoteRepository from "../repositorys/quoteRepository";
import customError from "../utils/interfaces/customError";
import processQuoteData from "../utils/quote/processQuoteData";

const getQuoteById = async (customerId: number, quoteId: number) => {
  const quote = await quoteRepository.getQuoteById(quoteId);

  if (!quote) {
    const error: customError = new Error("Not Found");
    error.status = 404;
    error.message = "Not Found";
    error.data = {
      message: "견적서를 찾을 수 없습니다.",
    };
    throw error;
  }

  const processedQuote = await processQuoteData(customerId, quote);

  return processedQuote;
};

export default {
  getQuoteById,
};
