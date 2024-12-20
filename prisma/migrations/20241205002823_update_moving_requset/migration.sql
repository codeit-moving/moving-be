/*
  Warnings:

  - You are about to drop the column `serviceType` on the `MovingRequest` table. All the data in the column will be lost.
  - Added the required column `service` to the `MovingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovingRequest" DROP COLUMN "serviceType",
ADD COLUMN     "service" INTEGER NOT NULL;
