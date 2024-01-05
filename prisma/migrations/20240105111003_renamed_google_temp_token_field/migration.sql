/*
  Warnings:

  - You are about to drop the column `tempGoogleToken` on the `UserGoogleAuth` table. All the data in the column will be lost.
  - You are about to drop the column `tempGoogleTokenExp` on the `UserGoogleAuth` table. All the data in the column will be lost.
  - Added the required column `tempToken` to the `UserGoogleAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGoogleAuth" DROP COLUMN "tempGoogleToken",
DROP COLUMN "tempGoogleTokenExp",
ADD COLUMN     "tempToken" TEXT NOT NULL,
ADD COLUMN     "tempTokenExp" TIMESTAMP(3);
