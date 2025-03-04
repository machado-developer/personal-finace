/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `Category_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [INCOME,EXPENSE] on the enum `Category_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `type` ENUM('RECEITA', 'DESPESA') NOT NULL;

-- AlterTable
ALTER TABLE `transaction` MODIFY `type` ENUM('RECEITA', 'DESPESA') NOT NULL;
