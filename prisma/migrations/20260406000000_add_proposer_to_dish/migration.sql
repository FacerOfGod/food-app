-- AlterTable: add proposerId to Dish (nullable, references User)
ALTER TABLE "Dish" ADD COLUMN "proposerId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
