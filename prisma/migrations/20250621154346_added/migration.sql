/*
  Warnings:

  - You are about to drop the column `orgRole` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "role" "OrgRole" NOT NULL DEFAULT 'BASIC';

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "orgRole",
ALTER COLUMN "role" SET DEFAULT 'BASIC';
