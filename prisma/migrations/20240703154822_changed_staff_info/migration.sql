/*
  Warnings:

  - You are about to drop the column `available` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Shift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "available",
DROP COLUMN "info",
DROP COLUMN "times",
ADD COLUMN     "description" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "date" SET DATA TYPE TEXT;
