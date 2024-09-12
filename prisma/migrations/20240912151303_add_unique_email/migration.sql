/*
  Warnings:

  - You are about to alter the column `status` on the `campaigns` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[email]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `campaigns` MODIFY `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `contacts_email_key` ON `contacts`(`email`);
