/*
  Warnings:

  - You are about to drop the column `imageProvider` on the `ItemBrand` table. All the data in the column will be lost.
  - You are about to drop the column `imageProvider` on the `ItemCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemBrand" DROP COLUMN "imageProvider",
ADD COLUMN     "imageProviderId" TEXT;

-- AlterTable
ALTER TABLE "ItemCategory" DROP COLUMN "imageProvider",
ADD COLUMN     "imageProviderId" TEXT;
