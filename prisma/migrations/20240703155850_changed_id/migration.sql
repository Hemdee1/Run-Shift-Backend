/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shift_companyId_key" ON "Shift"("companyId");
