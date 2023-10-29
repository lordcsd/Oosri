/*
  Warnings:

  - Added the required column `comment` to the `BuyerReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BuyerReview" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0;
