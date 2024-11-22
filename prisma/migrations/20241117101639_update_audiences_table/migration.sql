/*
  Warnings:

  - Added the required column `company_id` to the `audiences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audiences` ADD COLUMN `company_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `audiences` ADD CONSTRAINT `audiences_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
