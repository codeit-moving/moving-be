import prismaClient from "../utils/prismaClient";

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
  const { isRead, limit, lastCursorId: cursor } = query;
  return await prismaClient.notification.findMany({
    where: {
      userId,
      ...(isRead !== undefined && { isRead }),
    },
    take: limit,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createNotification = async (notification: Notification) => {
  return await prismaClient.notification.create({
    data: notification,
  });
};

const createManyNotification = async (notifications: Notification[]) => {
  return await prismaClient.notification.createMany({
    data: notifications,
  });
};

const isReadNotification = async (notificationId: number) => {
  return await prismaClient.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export default {
  findNotifications,
  createNotification,
  createManyNotification,
  isReadNotification,
};
