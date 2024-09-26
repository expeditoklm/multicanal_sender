/*
  Warnings:

  - You are about to drop the column `channel_id` on the `templates` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `templates_channel_id_fkey` ON `templates`;

-- AlterTable
ALTER TABLE `templates` DROP COLUMN `channel_id`;
