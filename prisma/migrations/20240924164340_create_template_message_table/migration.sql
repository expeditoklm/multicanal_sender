/*
  Warnings:

  - You are about to drop the `template_campaigns` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channel_id` to the `template_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `template_campaigns` DROP FOREIGN KEY `template_campaigns_message_id_fkey`;

-- DropForeignKey
ALTER TABLE `template_campaigns` DROP FOREIGN KEY `template_campaigns_template_id_fkey`;

-- DropForeignKey
ALTER TABLE `templates` DROP FOREIGN KEY `templates_channel_id_fkey`;

-- AlterTable
ALTER TABLE `template_types` ADD COLUMN `channel_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `template_campaigns`;

-- CreateTable
CREATE TABLE `template_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_id` INTEGER NOT NULL,
    `template_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `btn_txt` VARCHAR(191) NULL,
    `btn_link` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `template_types` ADD CONSTRAINT `template_types_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `template_messages` ADD CONSTRAINT `template_messages_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `template_messages` ADD CONSTRAINT `template_messages_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
