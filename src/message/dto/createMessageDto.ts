
import { IsInt, IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';
import { MessageStatus } from '@prisma/client';  // Assurez-vous d'importer l'enum correct depuis Prisma

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  object: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageStatus)
  status: MessageStatus;


  @IsNotEmpty()

  @IsInt()
  channel_id: number;

  @IsInt()
  campaign_id: number;

  @IsInt()
  audience_id: number;
}