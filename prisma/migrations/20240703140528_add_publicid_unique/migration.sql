/*
  Warnings:

  - You are about to drop the column `bytes` on the `ImageUrl` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ImageUrl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `ImageUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ImageUrl" DROP COLUMN "bytes",
DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ImageUrl_publicId_key" ON "ImageUrl"("publicId");
