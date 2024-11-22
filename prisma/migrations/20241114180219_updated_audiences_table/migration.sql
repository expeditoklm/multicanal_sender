/*
  Warnings:

  - You are about to drop the column `company_id` on the `audiences` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `audiences` DROP FOREIGN KEY `audiences_company_id_fkey`;

-- AlterTable
ALTER TABLE `audiences` DROP COLUMN `company_id`;
