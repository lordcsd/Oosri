/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserAuthProviderTypes" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "UserAuthProvider" (
    "id" SERIAL NOT NULL,
    "type" "UserAuthProviderTypes" NOT NULL DEFAULT 'LOCAL',
    "userId" INTEGER NOT NULL,
    "password" TEXT,
    "sessionStart" TIMESTAMP(3),
    "sessionEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuthProvider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAuthProvider" ADD CONSTRAINT "UserAuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
