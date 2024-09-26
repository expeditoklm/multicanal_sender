/*
  Warnings:

  - You are about to drop the column `channel_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_id` on the `template_campaigns` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_channel_id_fkey`;

-- DropForeignKey
ALTER TABLE `template_campaigns` DROP FOREIGN KEY `template_campaigns_campaign_id_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `channel_id`;

-- AlterTable
ALTER TABLE `template_campaigns` DROP COLUMN `campaign_id`;
