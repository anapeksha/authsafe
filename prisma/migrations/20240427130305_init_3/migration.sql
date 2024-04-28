/*
  Warnings:

  - You are about to drop the column `token` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,accessToken,refreshToken]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - The required column `accessToken` was added to the `Token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `refreshToken` was added to the `Token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Token_userId_token_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "token",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_accessToken_refreshToken_key" ON "Token"("userId", "accessToken", "refreshToken");
