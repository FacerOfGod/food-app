-- Dedup any existing (topic, name) collisions so the new unique can apply.
-- Keeps the row with the lowest rowid per (topic, name).
DELETE FROM "Dish"
WHERE rowid NOT IN (
  SELECT MIN(rowid) FROM "Dish" GROUP BY "topic", "name"
);

-- CreateIndex
CREATE INDEX "OtpCode_email_used_expiresAt_idx" ON "OtpCode"("email", "used", "expiresAt");
CREATE INDEX "OtpCode_createdAt_idx" ON "OtpCode"("createdAt");
CREATE INDEX "Session_hostId_idx" ON "Session"("hostId");
CREATE INDEX "Dish_topic_idx" ON "Dish"("topic");
CREATE INDEX "Dish_proposerId_idx" ON "Dish"("proposerId");
CREATE UNIQUE INDEX "Dish_topic_name_key" ON "Dish"("topic", "name");

-- RedefineTables: SQLite can't ALTER foreign key options, so the cascade
-- additions on SessionMember.userId and Vote.userId require table rebuilds.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_SessionMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedTopicsJson" TEXT NOT NULL DEFAULT '["food","movies","activities"]',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionMember_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SessionMember" ("id","sessionId","userId","sharedTopicsJson","joinedAt")
  SELECT "id","sessionId","userId","sharedTopicsJson","joinedAt" FROM "SessionMember";
DROP TABLE "SessionMember";
ALTER TABLE "new_SessionMember" RENAME TO "SessionMember";
CREATE UNIQUE INDEX "SessionMember_sessionId_userId_key" ON "SessionMember"("sessionId", "userId");
CREATE INDEX "SessionMember_sessionId_idx" ON "SessionMember"("sessionId");

CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("id","userId","dishId","rating","createdAt")
  SELECT "id","userId","dishId","rating","createdAt" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote_userId_dishId_key" ON "Vote"("userId", "dishId");

PRAGMA foreign_keys=ON;
