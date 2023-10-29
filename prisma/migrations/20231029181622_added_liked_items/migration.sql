-- CreateTable
CREATE TABLE "_BuyerProfileToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BuyerProfileToItem_AB_unique" ON "_BuyerProfileToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_BuyerProfileToItem_B_index" ON "_BuyerProfileToItem"("B");

-- AddForeignKey
ALTER TABLE "_BuyerProfileToItem" ADD CONSTRAINT "_BuyerProfileToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuyerProfileToItem" ADD CONSTRAINT "_BuyerProfileToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
