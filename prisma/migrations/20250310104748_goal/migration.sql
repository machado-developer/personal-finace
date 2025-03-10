/*
  Warnings:

  - You are about to drop the column `currentAmount` on the `goal` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `Goal_userId_fkey`;

-- DropIndex
DROP INDEX `Goal_userId_fkey` ON `goal`;

-- AlterTable
ALTER TABLE `goal` DROP COLUMN `currentAmount`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `savedAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    MODIFY `targetAmount` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `goalId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `Goal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
