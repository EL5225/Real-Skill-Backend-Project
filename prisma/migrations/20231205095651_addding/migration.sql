/*
  Warnings:

  - You are about to drop the column `is_watched` on the `Chapters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapters" DROP COLUMN "is_watched",
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Videos" ADD COLUMN     "is_watched" BOOLEAN NOT NULL DEFAULT false;
