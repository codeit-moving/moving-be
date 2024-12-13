/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Mover` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Mover" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "ProfileImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER,
    "moverId" INTEGER,

    CONSTRAINT "ProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImage_id_key" ON "ProfileImage"("id");

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_moverId_fkey" FOREIGN KEY ("moverId") REFERENCES "Mover"("id") ON DELETE SET NULL ON UPDATE CASCADE;
