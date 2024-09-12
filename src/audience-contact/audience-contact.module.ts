import { Module } from '@nestjs/common';
import { AudienceContactController } from './audience-contact.controller';
import { AudienceContactService } from './audience-contact.service';

@Module({
  controllers: [AudienceContactController],
  providers: [AudienceContactService]
})
export class AudienceContactModule {}
