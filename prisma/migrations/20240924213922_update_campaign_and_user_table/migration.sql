/*
  Warnings:

  - You are about to drop the column `user_id` on the `campaigns` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `campaigns` DROP FOREIGN KEY `campaigns_user_id_fkey`;

-- AlterTable
ALTER TABLE `campaigns` DROP COLUMN `user_id`;
