/*
  Warnings:

  - You are about to drop the `budget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deletedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `Budget_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `Budget_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `deletedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `budget`;
