-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT 'food',
    "category" TEXT,
    "imageUrl" TEXT,
    "proposerId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dish_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Dish" ("authorsJson", "category", "createdAt", "id", "imageUrl", "name", "order", "proposerId") SELECT "authorsJson", "category", "createdAt", "id", "imageUrl", "name", "order", "proposerId" FROM "Dish";
DROP TABLE "Dish";
ALTER TABLE "new_Dish" RENAME TO "Dish";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
