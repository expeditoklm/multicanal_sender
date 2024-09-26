-- AlterTable
ALTER TABLE `companies` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `sent_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user_company` ADD COLUMN `isMember` BOOLEAN NOT NULL DEFAULT false;
