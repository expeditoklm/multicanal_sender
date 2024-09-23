import { Global, Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue', // Nom de la file d'attente
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports : [MailerService]
})
export class MailerModule {}
