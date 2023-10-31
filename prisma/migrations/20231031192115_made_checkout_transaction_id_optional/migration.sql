-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_transactionId_fkey";

-- AlterTable
ALTER TABLE "Checkout" ALTER COLUMN "transactionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
