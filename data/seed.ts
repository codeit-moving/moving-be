import { users } from "./user";
import { customers } from "./customer";
import { services } from "./service";
import { regions } from "./region";
import { movers } from "./mover";
import { movingRequest } from "./movingRequest";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function main() {
  // 견적 요청 데이터 삭제 (가장 먼저 삭제)
  await prismaClient.movingRequest.deleteMany();

  // 기사, 고객, 서비스, 리전 데이터 삭제
  await prismaClient.mover.deleteMany();
  await prismaClient.customer.deleteMany();
  await prismaClient.service.deleteMany();
  await prismaClient.region.deleteMany();

  // 사용자 데이터 삭제 (마지막에 삭제)
  await prismaClient.user.deleteMany();

  // 사용자 데이터 시딩
  await prismaClient.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  // 고객 데이터 시딩
  await prismaClient.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  // 기사 데이터 시딩
  await prismaClient.mover.createMany({
    data: movers,
    skipDuplicates: true,
  });

  // 서비스 데이터 시딩
  await prismaClient.service.createMany({
    data: services,
    skipDuplicates: true,
  });

  // 리전 데이터 시딩
  await prismaClient.region.createMany({
    data: regions,
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
