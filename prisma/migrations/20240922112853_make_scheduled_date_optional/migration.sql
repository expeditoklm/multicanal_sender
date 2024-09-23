-- AlterTable
ALTER TABLE `messages` ADD COLUMN `scheduled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `scheduled_date` DATETIME(3) NULL;
