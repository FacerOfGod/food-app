-- AlterTable
ALTER TABLE "Session" ADD COLUMN "allowedTopicsJson" TEXT NOT NULL DEFAULT '["food","movies","activities"]';

-- AlterTable
ALTER TABLE "SessionMember" ADD COLUMN "sharedTopicsJson" TEXT NOT NULL DEFAULT '["food","movies","activities"]';
