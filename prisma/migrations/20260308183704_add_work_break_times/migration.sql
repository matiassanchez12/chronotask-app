-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "breakTimeMinutes" INTEGER DEFAULT 0,
ADD COLUMN     "workTimeMinutes" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pomodoroDuration" INTEGER NOT NULL DEFAULT 25,
    "shortBreakDuration" INTEGER NOT NULL DEFAULT 5,
    "longBreakDuration" INTEGER NOT NULL DEFAULT 15,
    "confirmBeforeDelete" BOOLEAN NOT NULL DEFAULT true,
    "fontSize" INTEGER NOT NULL DEFAULT 16,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
