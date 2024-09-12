import { Global, Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Global()
@Module({
  controllers: [MailerController],
  providers: [MailerService],
  exports : [MailerService]
})
export class MailerModule {}
