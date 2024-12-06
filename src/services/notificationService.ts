import dayjs from "dayjs";
import notificationRepository from "../repositorys/notificationRepository";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

interface Notification {
  isRead: boolean;
  content: string;
  userId: number;
}

interface Query {
  isRead: boolean | undefined;
  limit: number;
  lastCursorId: number | undefined;
}

dayjs.extend(relativeTime); //dayjs에 relativeTime 플러그인 추가
dayjs.locale("ko"); //dayjs에 한국어 설정

const calculateTimeGap = (createAt: Date | string): string => {
  return dayjs(createAt).fromNow();
}; //알림 생성 시간 계산

const findNotifications = async (userId: number, query: Query) => {
  const notifications = await notificationRepository.findNotifications(
    userId,
    query
  );

  const hasNext = notifications.length === query.limit; //다음 페이지 존재여부 확인

  const addTimeGap = notifications.map((notification) => ({
    ...notification,
    timeGap: calculateTimeGap(notification.createAt),
  })); //각 알림에 timeGap 추가

  return {
    notifications: addTimeGap,
    hasNext,
    lastCursorId:
      notifications.length > 0
        ? notifications[notifications.length - 1].id
        : null, //마지막 알림의 id
  };
};

const createNotification = async (notification: Notification) => {
  return await notificationRepository.createNotification(notification);
};

const isReadNotification = async (notificationId: number) => {
  return await notificationRepository.isReadNotification(notificationId);
};

export default {
  findNotifications,
  createNotification,
  isReadNotification,
};
