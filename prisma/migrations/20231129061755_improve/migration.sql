/*
  Warnings:

  - You are about to drop the column `class_id` on the `Videos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_class_id_fkey";

-- AlterTable
ALTER TABLE "Chapters" ADD COLUMN     "class_id" TEXT;

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "class_id";

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
