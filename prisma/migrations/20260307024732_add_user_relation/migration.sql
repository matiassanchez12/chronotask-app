-- Delete existing tasks (no userId assigned yet)
DELETE FROM "Task";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
