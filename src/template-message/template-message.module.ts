import { Module } from '@nestjs/common';
import { TemplateMessageController } from './template-message.controller';
import { TemplateMessageService } from './template-message.service';

@Module({
  controllers: [TemplateMessageController],
  providers: [TemplateMessageService]
})
export class TemplateMessageModule {}
