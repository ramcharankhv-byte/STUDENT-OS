/*
  Warnings:

  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `type` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET', 'EMAIL_CHANGE');

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "createdAt",
ADD COLUMN     "type" "TokenType" NOT NULL;
