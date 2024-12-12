import notificationRepository from "../repositorys/notificationRepository";
import "dayjs/locale/ko";
import calculateTimeGap from "../utils/timeGap.utils";

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

const findNotifications = async (userId: number, query: Query) => {
  const { limit, ...restQuery } = query;
  const addLimitNotifications = await notificationRepository.findNotifications(
    userId,
    {
      ...restQuery,
      limit: limit + 1, //한개 더 조회해서 다음 페이지 존재여부 확인
    }
  );

  const hasNext = addLimitNotifications.length > query.limit; //다음 페이지 존재여부 확인
  const notifications = addLimitNotifications.slice(0, limit); //한개 더 조회한 데이터 제거
  const lastCursorId = hasNext ? notifications[limit - 1].id : null; //마지막 알림의 id

  const addTimeGap = notifications.map((notification) => ({
    ...notification,
    timeGap: calculateTimeGap(notification.createAt),
  })); //각 알림에 timeGap 추가

  return {
    notifications: addTimeGap,
    hasNext,
    lastCursorId,
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
