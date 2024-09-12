import { Module } from '@nestjs/common';
import { MessageContactController } from './message-contact.controller';
import { MessageContactService } from './message-contact.service';

@Module({
  controllers: [MessageContactController],
  providers: [MessageContactService]
})
export class MessageContactModule {}
