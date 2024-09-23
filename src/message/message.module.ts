import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue', // nom de la file d'attente
    }),
    ScheduleModule.forRoot()
  ],
  
})
export class MessageModule {}
