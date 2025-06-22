/*
  Warnings:

  - Added the required column `orgRole` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BASIC', 'PRO', 'PREMIUM', 'ULTRA');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('BASIC', 'PRO', 'PREMIUM', 'ULTRA');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "orgRole" "OrgRole" NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL;
