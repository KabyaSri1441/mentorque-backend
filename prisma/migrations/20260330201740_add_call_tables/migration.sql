/*
  Warnings:

  - You are about to drop the column `calendar_event_id` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `google_event_id` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `google_refresh_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "calendar_event_id",
DROP COLUMN "google_event_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "google_refresh_token",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "call_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultTags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "call_type_id" TEXT NOT NULL,
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "call_types_name_key" ON "call_types"("name");

-- CreateIndex
CREATE INDEX "calls_user_id_idx" ON "calls"("user_id");

-- CreateIndex
CREATE INDEX "calls_mentor_id_idx" ON "calls"("mentor_id");

-- CreateIndex
CREATE INDEX "calls_call_type_id_idx" ON "calls"("call_type_id");

-- CreateIndex
CREATE INDEX "availabilities_user_id_idx" ON "availabilities"("user_id");

-- CreateIndex
CREATE INDEX "availabilities_mentor_id_idx" ON "availabilities"("mentor_id");

-- CreateIndex
CREATE INDEX "availabilities_role_idx" ON "availabilities"("role");

-- CreateIndex
CREATE INDEX "availabilities_date_idx" ON "availabilities"("date");

-- CreateIndex
CREATE INDEX "availabilities_user_id_date_idx" ON "availabilities"("user_id", "date");

-- CreateIndex
CREATE INDEX "availabilities_mentor_id_date_idx" ON "availabilities"("mentor_id", "date");

-- CreateIndex
CREATE INDEX "availabilities_role_date_idx" ON "availabilities"("role", "date");

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_call_type_id_fkey" FOREIGN KEY ("call_type_id") REFERENCES "call_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
