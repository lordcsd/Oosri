/*
  Warnings:

  - You are about to drop the column `buyerId` on the `BuyerReview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId]` on the table `Checkout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewId` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BuyerReview" DROP CONSTRAINT "BuyerReview_buyerId_fkey";

-- AlterTable
ALTER TABLE "BuyerReview" DROP COLUMN "buyerId";

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "reviewId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_reviewId_key" ON "Checkout"("reviewId");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "BuyerReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
