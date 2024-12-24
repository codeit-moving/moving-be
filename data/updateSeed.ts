import { PrismaClient } from "@prisma/client";
import { movers } from "./mover";
import { users } from "./user";
import { customers } from "./customer";

const prisma = new PrismaClient();

async function main() {
  await prisma.quote.deleteMany();
  await prisma.movingRequest.deleteMany();
  await prisma.region.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.mover.deleteMany();

  await prisma.user.createMany({ data: users });
  await prisma.customer.createMany({ data: customers });
  await prisma.mover.createMany({ data: movers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
