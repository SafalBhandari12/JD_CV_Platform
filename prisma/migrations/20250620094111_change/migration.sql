/*
  Warnings:

  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
