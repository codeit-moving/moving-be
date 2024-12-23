import { users } from "./user";
import { customers } from "./customer";
import { services } from "./service";
import { regions } from "./region";
import { movers } from "./mover";
import { quote } from "./quote";
import { confirmedQuote } from "./confirmedQuote";
import { movingRequest } from "./movingRequest";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function main() {
  try {
    // 1. 기존 데이터 삭제 및 시퀀스 초기화
    await prismaClient.$executeRaw`TRUNCATE TABLE "Review" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "ConfirmedQuote" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "Quote" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "MovingRequest" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "Mover" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "Customer" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "Service" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "Region" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;

    // 2. User 데이터 생성 및 확인
    console.log("Creating users...");
    const createdUsers = await prismaClient.user.createMany({
      data: users,
      skipDuplicates: true,
    });
    console.log("Created users count:", createdUsers.count);

    // User 데이터 확인
    const userCount = await prismaClient.user.count();
    console.log("Total users in database:", userCount);

    // 3. 기본 테이블 데이터 생성
    console.log("Creating services...");
    await prismaClient.service.createMany({
      data: services,
      skipDuplicates: true,
    });

    console.log("Creating regions...");
    await prismaClient.region.createMany({
      data: regions,
      skipDuplicates: true,
    });

    // 4. User 테이블을 참조하는 테이블 데이터 생성
    console.log("Creating customers...");
    await prismaClient.customer.createMany({
      data: customers,
      // skipDuplicates: true,
    });

    console.log("Creating movers...");
    await prismaClient.mover.createMany({
      data: movers,
      skipDuplicates: true,
    });

    // 5. Customer를 참조하는 MovingRequest 데이터 생성
    console.log("Creating moving requests...");
    await prismaClient.movingRequest.createMany({
      data: movingRequest,
      skipDuplicates: true,
    });

    // 6. MovingRequest와 Mover를 참조하는 Quote 데이터 생성
    console.log("Creating quotes...");
    await prismaClient.quote.createMany({
      data: quote,
      skipDuplicates: true,
    });

    // 7. Quote를 참조하는 ConfirmedQuote 데이터 생성
    console.log("Creating confirmed quotes...");
    await prismaClient.confirmedQuote.createMany({
      data: confirmedQuote,
      skipDuplicates: true,
    });

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Detailed error:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
