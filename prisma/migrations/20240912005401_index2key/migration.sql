/*
  Warnings:

  - A unique constraint covering the columns `[user_id,company_id]` on the table `user_company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_company_user_id_company_id_key` ON `user_company`(`user_id`, `company_id`);
