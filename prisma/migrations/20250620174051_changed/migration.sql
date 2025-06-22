/*
  Warnings:

  - You are about to drop the column `userId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `UserProfile` table. All the data in the column will be lost.
  - Added the required column `introduction` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_userId_fkey";

-- DropIndex
DROP INDEX "Organization_userId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "university",
ADD COLUMN     "introduction" TEXT NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL,
ADD COLUMN     "resume" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "degree" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_id_fkey" FOREIGN KEY ("id") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
