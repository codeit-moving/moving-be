import prismaClient from "../utils/prismaClient";

interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface Customer {
  userId: number;
  imageUrl: string | null;
  services: number[];
  regions: number[];
}

interface Mover {
  userId: number;
  nickname: string;
  career: number;
  introduction: string;
  description: string;
  imageUrl: string | null;
  services: number[];
  regions: number[];
}

const findByEmail = (email: string) => {
  return prismaClient.user.findUnique({
    where: { email: email },
    select: {
      name: true,
      password: true,
    },
  });
};

const existingUser = (email: string, phoneNumber: string) => {
  return prismaClient.user.findFirst({
    where: { OR: [{ email }, { phoneNumber }] },
  });
};

const createUser = (tx: any, userData: User) => {
  return tx.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  });
};

const createCustomer = (tx: any, customerData: Customer) => {
  return tx.customer.create({
    data: customerData,
  });
};

const createMover = (tx: any, moverData: Mover) => {
  return tx.mover.create({
    data: moverData,
  });
};

export default {
  findByEmail,
  createUser,
  createCustomer,
  createMover,
  existingUser,
};
