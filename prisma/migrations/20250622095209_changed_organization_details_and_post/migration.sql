/*
  Warnings:

  - Added the required column `logo` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "organizationPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "skills" TEXT[],
    "education" TEXT[],
    "experience" INTEGER NOT NULL,
    "responsibilities" TEXT[],
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "organizationPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "organizationPost" ADD CONSTRAINT "organizationPost_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
