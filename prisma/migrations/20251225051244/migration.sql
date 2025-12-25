/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `IssueImage` table. All the data in the column will be lost.
  - Added the required column `image` to the `IssueImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `IssueImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IssueImage" DROP COLUMN "imageUrl",
ADD COLUMN     "image" BYTEA NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
