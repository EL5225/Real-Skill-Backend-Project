/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `learning_material` on the `Classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `about` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modules` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapters" DROP CONSTRAINT "Chapters_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_chapter_id_fkey";

-- AlterTable
ALTER TABLE "Chapters" ADD COLUMN     "is_watched" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "admin_id",
DROP COLUMN "learning_material",
ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "modules" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_id_key" ON "User"("admin_id");

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
