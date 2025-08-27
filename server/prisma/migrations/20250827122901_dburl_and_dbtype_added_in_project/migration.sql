/*
  Warnings:

  - A unique constraint covering the columns `[dbUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "dbType" TEXT NOT NULL DEFAULT 'postgresql',
ADD COLUMN     "dbUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_dbUrl_key" ON "public"."Project"("dbUrl");
