/*
  Warnings:

  - A unique constraint covering the columns `[sellerProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[buyerProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "buyerProfileId" INTEGER,
ADD COLUMN     "sellerProfileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_sellerProfileId_key" ON "User"("sellerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_buyerProfileId_key" ON "User"("buyerProfileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_buyerProfileId_fkey" FOREIGN KEY ("buyerProfileId") REFERENCES "BuyerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
