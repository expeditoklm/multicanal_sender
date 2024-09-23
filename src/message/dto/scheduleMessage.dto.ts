import { IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleMessageDto {
  @IsNotEmpty()
  @IsInt()
  messageId: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)  // Ajout de la conversion de chaîne en Date
  scheduledDate: Date;
}
