import { MessageStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class GetMessagesByStatusDto {
    @IsEnum(MessageStatus)
    @IsNotEmpty()
    status: MessageStatus;
  }