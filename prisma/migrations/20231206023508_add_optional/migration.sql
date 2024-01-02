-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_level_id_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_type_id_fkey";

-- AlterTable
ALTER TABLE "Classes" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "category_id" DROP NOT NULL,
ALTER COLUMN "level_id" DROP NOT NULL,
ALTER COLUMN "type_id" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Levels"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Types"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
