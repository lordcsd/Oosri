/*
  Warnings:

  - You are about to drop the column `reviewId` on the `Checkout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId]` on the table `CheckoutItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewId` to the `CheckoutItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_reviewId_fkey";

-- DropIndex
DROP INDEX "Checkout_reviewId_key";

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "CheckoutItem" ADD COLUMN     "reviewId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutItem_reviewId_key" ON "CheckoutItem"("reviewId");

-- AddForeignKey
ALTER TABLE "CheckoutItem" ADD CONSTRAINT "CheckoutItem_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "BuyerReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
