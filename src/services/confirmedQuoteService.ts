import confirmedQuoteRepository from "../repositorys/confirmedQuoteRepository";
import movingRequestRepository from "../repositorys/movingRequestRepository";
import notificationRepository from "../repositorys/notificationRepository";
import quoteRepository from "../repositorys/quoteRepository";
import { throwHttpError } from "../utils/constructors/httpError";

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
    return throwHttpError(404, "활성중인 이사요청이 없습니다.");
  }
  if (!quote) {
    return throwHttpError(404, "견적서를 찾을 수 없습니다.");
  }

  const confirmedQuote = await confirmedQuoteRepository.CreateConfirmedQuote({
    movingRequestId: activeMovingRequest.id,
    quoteId: quote.id,
    customerId: confirmedQuoteData.customerId,
    moverId: quote.mover.id,
  });

  //알림 생성 기사에게
  notificationRepository.createNotification({
    userId: quote.mover.id,
    content: `${quote.mover.nickname}기사님 ${confirmedQuote.customer.user.name}님의 이사요청이 ,확정,되었어요.`,
    isRead: false,
  });

  //알림 생성 고객에게
  notificationRepository.createNotification({
    userId: confirmedQuoteData.customerId,
    content: `${quote.mover.nickname}기사님의 견적이 ,확정,되었어요.`,
    isRead: false,
  });

  return confirmedQuote;
};

export default {
  createConfirmedQuote,
};
