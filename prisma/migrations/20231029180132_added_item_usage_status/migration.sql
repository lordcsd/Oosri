/*
  Warnings:

  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - Added the required column `usedStatus` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ITEM_SUBMISSION_STATUS" AS ENUM ('SUBMITTED', 'ADMIN_REJECTED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "ITEM_USAGE_STATUS" AS ENUM ('NEW', 'USED');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "status",
ADD COLUMN     "submissionStatus" "ITEM_SUBMISSION_STATUS" NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "usedStatus" "ITEM_USAGE_STATUS" NOT NULL;

-- DropEnum
DROP TYPE "ITEM_STATUS";
