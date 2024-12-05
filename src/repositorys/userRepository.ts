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

interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
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

const findById = (userId: number) => {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      phoneNumber: true,
      password: true,
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

const getCustomer = (userId: number) => {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      isOAuth: true,
      customer: {
        select: {
          id: true,
          imageUrl: true,
          services: true,
          regions: true,
        },
      },
    },
  });
};

const getMover = (userId: number) => {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      isOAuth: true,
      mover: {
        select: {
          id: true,
          nickname: true,
          career: true,
          introduction: true,
          description: true,
          imageUrl: true,
          services: true,
          regions: true,
        },
      },
    },
  });
};

const getUserType = async (userId: number) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      customer: {
        select: { id: true },
      },
      mover: {
        select: { id: true },
      },
    },
  });
  if (user?.customer) {
    return "customer";
  } else if (user?.mover) {
    return "mover";
  } else {
    return null;
  }
};

const updateUser = async (userId: number, data: UpdateUser) => {
  return prismaClient.user.update({
    where: { id: userId },
    data,
  });
};

export default {
  findByEmail,
  createCustomer,
  createMover,
  existingUser,
  createUser,
  getUserType,
  getCustomer,
  getMover,
  updateUser,
  findById,
};