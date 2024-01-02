/*
  Warnings:

  - The primary key for the `Completed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Completed` table. All the data in the column will be lost.
  - The primary key for the `Watched` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Watched` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Completed" DROP CONSTRAINT "Completed_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Completed_pkey" PRIMARY KEY ("chapter_id", "user_id");

-- AlterTable
ALTER TABLE "Watched" DROP CONSTRAINT "Watched_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Watched_pkey" PRIMARY KEY ("video_id", "user_id");
