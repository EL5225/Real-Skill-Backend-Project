/*
  Warnings:

  - Added the required column `time` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classes" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Videos" ADD COLUMN     "chapters_id" TEXT,
ADD COLUMN     "time" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Profiles" (
    "id" TEXT NOT NULL,
    "profile_picture" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_user_id_key" ON "Profiles"("user_id");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_chapters_id_fkey" FOREIGN KEY ("chapters_id") REFERENCES "Chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
