-- AlterTable: add authorsJson to Dish (JSON array of contributor names)
ALTER TABLE "Dish" ADD COLUMN "authorsJson" TEXT NOT NULL DEFAULT '[]';
