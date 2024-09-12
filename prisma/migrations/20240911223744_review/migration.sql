-- AlterTable
ALTER TABLE `audiences` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `campaigns` MODIFY `start_date` DATETIME(3) NULL,
    MODIFY `end_date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `companies` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `tertiary_color` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `whatsapp` VARCHAR(191) NULL,
    MODIFY `location` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `contacts` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(191) NULL,
    MODIFY `source` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `template_campaigns` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `link` VARCHAR(191) NULL,
    MODIFY `btn_txt` VARCHAR(191) NULL,
    MODIFY `btn_link` VARCHAR(191) NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `templates` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(191) NULL;
