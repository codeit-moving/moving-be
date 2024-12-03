/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_key" ON "Service"("code");
