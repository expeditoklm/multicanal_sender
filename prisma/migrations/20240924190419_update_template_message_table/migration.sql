/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `template_messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `template_messages_message_id_key` ON `template_messages`(`message_id`);
