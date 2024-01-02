/*
  Warnings:

  - You are about to drop the column `prerequisite` on the `Classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "prerequisite",
ADD COLUMN     "prerequisites" TEXT[];
