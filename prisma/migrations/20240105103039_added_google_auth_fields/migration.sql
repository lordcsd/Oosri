/*
  Warnings:

  - The `profileImageProviders` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sessionEnd` on the `UserAuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `sessionStart` on the `UserAuthProvider` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PROFILE_IMAGE_PROVIDER" AS ENUM ('CLOUDINARY', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImageProviders",
ADD COLUMN     "profileImageProviders" "PROFILE_IMAGE_PROVIDER" DEFAULT 'CLOUDINARY';

-- AlterTable
ALTER TABLE "UserAuthProvider" DROP COLUMN "sessionEnd",
DROP COLUMN "sessionStart",
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tempGoogleToken" TEXT,
ADD COLUMN     "tempGoogleTokenExp" TIMESTAMP(3);
