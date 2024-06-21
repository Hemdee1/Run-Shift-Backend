/*
  Warnings:

  - You are about to drop the column `firstName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shift` table. All the data in the column will be lost.
  - The `times` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `managersFirstName` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managersLastName` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "managersFirstName" TEXT NOT NULL,
ADD COLUMN     "managersLastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "userId",
ADD COLUMN     "appliedStaff" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "staffId" TEXT NOT NULL,
DROP COLUMN "times",
ADD COLUMN     "times" TEXT[];

-- DropTable
DROP TABLE "Users";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
