import prismaClient from "../utils/prismaClient";

interface User {
  name: string;
  email: string;
  password: string | null;
  phoneNumber: string;
  isOAuth: boolean;
}

interface Customer extends User {
  imageUrl: string | null;
  services: number[];
  regions: number[];
}

interface Mover extends User {
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
      id: true,
      password: true,
      customer: {
        select: { id: true },
      },
      mover: {
        select: { id: true },
      },
    },
  });
};

const existingUser = (email: string, phoneNumber: string) => {
  return prismaClient.user.findFirst({
    where: { OR: [{ email }, { phoneNumber }] },
  });
};

const createUser = (user: User) => {
  return prismaClient.user.create({
    data: user,
  });
};

const createCustomer = (customer: Customer) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    isOAuth,
    imageUrl,
    services,
    regions,
  } = customer;

  const userData = {
    name,
    email,
    password,
    phoneNumber,
    isOAuth,
  };

  const customerData = {
    imageUrl,
    services,
    regions,
  };

  return prismaClient.user.create({
    data: {
      ...userData,
      customer: {
        create: customerData,
      },
    },
  });
};

const createMover = (mover: Mover) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    isOAuth,
    nickname,
    career,
    introduction,
    description,
    imageUrl,
    services,
    regions,
  } = mover;

  const userData = {
    name,
    email,
    password,
    phoneNumber,
    isOAuth,
  };

  const moverData = {
    nickname,
    career,
    introduction,
    description,
    imageUrl,
    services,
    regions,
  };

  return prismaClient.user.create({
    data: {
      ...userData,
      mover: {
        create: moverData,
      },
    },
  });
};

const getUser = (userId: number) => {
  return prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
      mover: true,
    },
  });
};

export default {
  findByEmail,
  createCustomer,
  createMover,
  existingUser,
  createUser,
  getUser,
};
