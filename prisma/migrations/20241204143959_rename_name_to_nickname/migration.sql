/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isReviewer` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the new nickname column allowing NULL
ALTER TABLE "User" ADD COLUMN "nickname" TEXT;

-- Copy data from name to nickname
UPDATE "User" SET "nickname" = "name";

-- Now make nickname NOT NULL
ALTER TABLE "User" ALTER COLUMN "nickname" SET NOT NULL;

-- Drop old columns
ALTER TABLE "User" DROP COLUMN "name";
ALTER TABLE "User" DROP COLUMN "avatar";
ALTER TABLE "User" DROP COLUMN "bio";
ALTER TABLE "User" DROP COLUMN "expertise";
ALTER TABLE "User" DROP COLUMN "isReviewer";
ALTER TABLE "User" DROP COLUMN "role";
