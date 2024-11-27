import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FindUserByEmail {
  email: string;
}

const postAuthSigninRepository = async ({ email }: FindUserByEmail) => {
  return prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });
};

export { postAuthSigninRepository };
