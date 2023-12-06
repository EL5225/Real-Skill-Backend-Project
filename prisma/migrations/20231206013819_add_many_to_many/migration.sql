/*
  Warnings:

  - You are about to drop the column `user_id` on the `Classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_user_id_fkey";

-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "_ClassesToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassesToUser_AB_unique" ON "_ClassesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassesToUser_B_index" ON "_ClassesToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClassesToUser" ADD CONSTRAINT "_ClassesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassesToUser" ADD CONSTRAINT "_ClassesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
