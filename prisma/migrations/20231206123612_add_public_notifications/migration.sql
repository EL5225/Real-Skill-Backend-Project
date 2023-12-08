-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PublicNotifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicNotifications_pkey" PRIMARY KEY ("id")
);
