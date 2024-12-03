/*
  Warnings:

  - You are about to drop the `_companion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_companion" DROP CONSTRAINT "_companion_A_fkey";

-- DropForeignKey
ALTER TABLE "_companion" DROP CONSTRAINT "_companion_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOAuth" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- DropTable
DROP TABLE "_companion";

-- CreateTable
CREATE TABLE "_Rejected" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Rejected_AB_unique" ON "_Rejected"("A", "B");

-- CreateIndex
CREATE INDEX "_Rejected_B_index" ON "_Rejected"("B");

-- AddForeignKey
ALTER TABLE "_Rejected" ADD CONSTRAINT "_Rejected_A_fkey" FOREIGN KEY ("A") REFERENCES "Mover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Rejected" ADD CONSTRAINT "_Rejected_B_fkey" FOREIGN KEY ("B") REFERENCES "MovingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
