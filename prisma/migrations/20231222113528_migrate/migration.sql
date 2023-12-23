/*
  Warnings:

  - You are about to drop the column `created_at` on the `Completed` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Watched` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Completed" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "Watched" DROP COLUMN "created_at";
