/*
  Warnings:

  - Changed the type of `size` on the `Organization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Organization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "organizationType" AS ENUM ('STARTUP', 'SME', 'CORPORATE', 'NGO');

-- CreateEnum
CREATE TYPE "organizationSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "size",
ADD COLUMN     "size" "organizationSize" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "organizationType" NOT NULL;

-- DropEnum
DROP TYPE "OrganizationType";
