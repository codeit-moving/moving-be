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

const extractLocationInfo = (address: string) => {
  // 시/도와 시/군/구를 추출하는 정규식
  const match = address.match(/([가-힣]+)\s([가-힣]+시[가-힣]*)/);
  if (!match) return address;

  const province = match[1]; // 첫 번째 그룹 (시/도)
  const city = match[2].replace(/시.*$/, ""); // 두 번째 그룹에서 '시' 이후 제거

  return `${province}(${city})`;
};

const setMessage = async (confirmedQuote: ConfirmedQuote) => {
  const pickupLocation = extractLocationInfo(
    confirmedQuote.movingRequest.pickupAddress
  );
  const dropOffLocation = extractLocationInfo(
    confirmedQuote.movingRequest.dropOffAddress
  );
  return [
    {
      content: `내일은 ,${pickupLocation} -> ${dropOffLocation} 이사 예정일,이에요.`,
      isRead: false,
      userId: confirmedQuote.mover.user.id,
    },
    {
      content: `내일은 ,${pickupLocation} -> ${dropOffLocation} 이사 예정일,이에요.`,
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
