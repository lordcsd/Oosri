/*
  Warnings:

  - The `createdBy` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" INTEGER;
