/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `Levels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Levels` table. All the data in the column will be lost.
  - The primary key for the `Types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Types` table. All the data in the column will be lost.
  - You are about to drop the column `chapters_id` on the `Videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Types` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `Categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category_id` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level_id` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Levels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `payment_date` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Levels" DROP CONSTRAINT "Levels_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Types" DROP CONSTRAINT "Types_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_chapters_id_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_class_id_fkey";

-- DropIndex
DROP INDEX "Types_class_id_key";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "class_id",
DROP COLUMN "thumbnail",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Classes" ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "level_id" INTEGER NOT NULL,
ADD COLUMN     "type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Levels" DROP CONSTRAINT "Levels_pkey",
DROP COLUMN "class_id",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Levels_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_method" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Types" DROP CONSTRAINT "Types_pkey",
DROP COLUMN "class_id",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "chapters_id",
ADD COLUMN     "chapter_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Classes_code_key" ON "Classes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Levels_name_key" ON "Levels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Types_name_key" ON "Types"("name");

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Levels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
