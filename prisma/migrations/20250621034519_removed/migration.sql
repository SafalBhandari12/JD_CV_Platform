/*
  Warnings:

  - The values [COMMON_COMPLETED] on the enum `RegistrationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `VerificationToken` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationStatus_new" AS ENUM ('EMAIL_VERIFICATION_PENDING', 'EMAIL_VERIFIED', 'FULLY_REGISTERED');
ALTER TABLE "User" ALTER COLUMN "registrationStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "registrationStatus" TYPE "RegistrationStatus_new" USING ("registrationStatus"::text::"RegistrationStatus_new");
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
ALTER TYPE "RegistrationStatus_new" RENAME TO "RegistrationStatus";
DROP TYPE "RegistrationStatus_old";
ALTER TABLE "User" ALTER COLUMN "registrationStatus" SET DEFAULT 'EMAIL_VERIFICATION_PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "registrationStatus" SET DEFAULT 'EMAIL_VERIFICATION_PENDING';

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "password",
DROP COLUMN "role";
