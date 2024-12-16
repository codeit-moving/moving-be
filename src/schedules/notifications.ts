import cron from "node-cron";
import notificationRepository from "../repositorys/notificationRepository";
import confirmedQuoteRepository from "../repositorys/confirmedQuoteRepository";

interface ConfirmedQuote {
  id: number;
  movingRequest: {
    service: number;
    movingDate: Date;
    pickupAddress: string;
    dropOffAddress: string;
  };
  customer: {
    user: {
      id: number;
      name: string;
    };
  };
  quote: {
    id: number;
  };
  mover: {
    user: {
      id: number;
    };
    nickname: string;
  };
}

const setMessage = async (confirmedQuote: ConfirmedQuote) => {
  return [
    {
      content: `내일은 ,${confirmedQuote.movingRequest.pickupAddress} -> ${confirmedQuote.movingRequest.dropOffAddress} 이사 예정일,이에요.`,
      isRead: false,
      userId: confirmedQuote.mover.user.id,
    },
    {
      content: `내일은 ,${confirmedQuote.movingRequest.pickupAddress} -> ${confirmedQuote.movingRequest.dropOffAddress} 이사 예정일,이에요.`,
      isRead: false,
      userId: confirmedQuote.customer.user.id,
    },
  ];
};

export const initNotification = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const confirmedQuotes = await confirmedQuoteRepository.findAllByDay(
      tomorrow
    );

    for (const request of confirmedQuotes) {
      const notificationType = await setMessage(request);

      notificationRepository.createManyNotification(notificationType);
    }

    console.log(
      `${tomorrow.toISOString()} - 알림 발송 완료: ${confirmedQuotes.length}건`
    );
  } catch (error) {
    console.error("알림 발송 중 오류 발생:", error);
  }
};
