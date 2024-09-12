import { IsInt, IsNotEmpty } from "class-validator";

export class SendMessageDto {
    @IsInt()
    @IsNotEmpty()
    messageId: number;
  }