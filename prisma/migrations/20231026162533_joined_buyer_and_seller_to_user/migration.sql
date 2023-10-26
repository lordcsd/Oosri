/*
  Warnings:

  - You are about to drop the column `itemId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `ItemColor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hexcode]` on the table `ItemColor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `soldAt` to the `CheckoutItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releasedUnits` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitsLeft` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BuyerReview" DROP CONSTRAINT "BuyerReview_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sellerId_fkey";

-- DropIndex
DROP INDEX "Transaction_itemId_key";

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "isCart" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "CheckoutItem" ADD COLUMN     "soldAt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "units" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "releasedUnits" INTEGER NOT NULL,
ADD COLUMN     "unitsLeft" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "itemId",
DROP COLUMN "sellerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Buyer";

-- DropTable
DROP TABLE "Seller";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "country" TEXT,
    "profileImage" TEXT,
    "profileImageProviders" TEXT,
    "walletBalance" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ItemColor_name_key" ON "ItemColor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemColor_hexcode_key" ON "ItemColor"("hexcode");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerReview" ADD CONSTRAINT "BuyerReview_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
