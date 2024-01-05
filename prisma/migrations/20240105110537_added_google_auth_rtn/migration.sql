/*
  Warnings:

  - You are about to drop the `UserAuthProvider` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[localAuthId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleAuthId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserAuthProvider" DROP CONSTRAINT "UserAuthProvider_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleAuthId" INTEGER,
ADD COLUMN     "localAuthId" INTEGER;

-- DropTable
DROP TABLE "UserAuthProvider";

-- DropEnum
DROP TYPE "UserAuthProviderTypes";

-- CreateTable
CREATE TABLE "UserLocalAuth" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLocalAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoogleAuth" (
    "id" SERIAL NOT NULL,
    "tempGoogleToken" TEXT NOT NULL,
    "tempGoogleTokenExp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGoogleAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_localAuthId_key" ON "User"("localAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleAuthId_key" ON "User"("googleAuthId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_localAuthId_fkey" FOREIGN KEY ("localAuthId") REFERENCES "UserLocalAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_googleAuthId_fkey" FOREIGN KEY ("googleAuthId") REFERENCES "UserGoogleAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
