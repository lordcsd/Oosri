-- DropIndex
DROP INDEX "CheckoutItem_itemId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
