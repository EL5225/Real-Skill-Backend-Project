/*
  Warnings:

  - You are about to drop the column `is_completed` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `is_watched` on the `Videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapters" DROP COLUMN "is_completed";

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "is_watched";

-- CreateTable
CREATE TABLE "Watched" (
    "id" TEXT NOT NULL,
    "is_watched" BOOLEAN NOT NULL DEFAULT false,
    "video_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completed" (
    "id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "chapter_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Completed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Completed" ADD CONSTRAINT "Completed_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Completed" ADD CONSTRAINT "Completed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
