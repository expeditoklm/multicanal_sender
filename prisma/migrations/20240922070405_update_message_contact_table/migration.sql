/*
  Warnings:

  - Made the column `status` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `message_contacts` ADD COLUMN `hasRecevedMsg` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `messages` MODIFY `status` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL;
