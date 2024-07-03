/*
  Warnings:

  - Added the required column `bytes` to the `ImageUrl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageUrl" ADD COLUMN     "bytes" INTEGER NOT NULL;
