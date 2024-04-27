/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiKey_userId_key_key";

-- DropIndex
DROP INDEX "Token_userId_accessToken_refreshToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
