-- DropForeignKey
ALTER TABLE "CheckoutItem" DROP CONSTRAINT "CheckoutItem_reviewId_fkey";

-- AlterTable
ALTER TABLE "CheckoutItem" ALTER COLUMN "soldAt" DROP NOT NULL,
ALTER COLUMN "reviewId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CheckoutItem" ADD CONSTRAINT "CheckoutItem_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "BuyerReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
