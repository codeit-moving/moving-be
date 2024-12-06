import prismaClient from "../utils/prismaClient";

interface Notification {
  isRead: boolean;
  content: string;
  userId: number;
}

interface Query {
  isRead: boolean;
  limit: number;
  lastCursorId: number | undefined;
}

const findNotifications = async (userId: number, query: Query) => {
  return await prismaClient.notification.findMany({
    where: {
      userId, //userId에 해당하는 알림
      isRead: query.isRead,
    },
    take: query.limit,
    ...(query.lastCursorId && { cursor: { id: query.lastCursorId } }),
    skip: query.lastCursorId ? 1 : 0, //마지막 cursorId가 존재하면 1개 건너뛰기
    orderBy: {
      id: "desc",
    },
  });
}; //userId에 해당하는 알림 중 읽지 않은 알림 찾기

const createNotification = async (notification: Notification) => {
  return await prismaClient.notification.create({
    data: notification,
  });
};

const isReadNotification = async (notificationId: number) => {
  return await prismaClient.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export default { findNotifications, createNotification, isReadNotification };
