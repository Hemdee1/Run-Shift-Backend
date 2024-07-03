/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ImageUrl` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `ImageUrl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageUrl" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TEXT NOT NULL;
