/*
  Warnings:

  - You are about to drop the column `movingInfoId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `movingRequestId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_movingInfoId_fkey";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "movingInfoId",
DROP COLUMN "price",
ADD COLUMN     "cost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "movingRequestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_movingRequestId_fkey" FOREIGN KEY ("movingRequestId") REFERENCES "MovingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
