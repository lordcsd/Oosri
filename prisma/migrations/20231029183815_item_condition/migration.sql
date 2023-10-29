/*
  Warnings:

  - You are about to drop the column `submissionStatus` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `usedStatus` on the `Item` table. All the data in the column will be lost.
  - Added the required column `condition` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ITEM_CONDITION" AS ENUM ('BRAND_NEW', 'REFURBISHED', 'USED');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "submissionStatus",
DROP COLUMN "usedStatus",
ADD COLUMN     "condition" "ITEM_CONDITION" NOT NULL,
ADD COLUMN     "status" "ITEM_SUBMISSION_STATUS" NOT NULL DEFAULT 'SUBMITTED';

-- DropEnum
DROP TYPE "ITEM_USAGE_STATUS";
