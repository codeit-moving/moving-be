import quoteRepository from "../repositorys/quoteRepository";
import customError from "../utils/interfaces/customError";
import getRatingsByMoverIds from "../utils/mover/getRatingsByMover";
import processMoverData from "../utils/processMoverData";

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

  const isDesignated = quote.movingRequest.mover.some(
    (mover) => mover.id === quote.mover.id
  );

  const ratingsByMover = await getRatingsByMoverIds(quote.mover.id);
  const processMovers = processMoverData(
    customerId,
    quote.mover,
    ratingsByMover
  );

  const { mover: movingRequestMover, ...movingRequestRest } =
    quote.movingRequest;
  const { mover, movingRequest, ...rest } = quote;

  return {
    movingRequest: movingRequestRest,
    ...rest,
    mover: processMovers,
    isDesignated,
  };
};

export default {
  getQuoteById,
};
