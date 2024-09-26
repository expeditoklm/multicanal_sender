import { PartialType } from '@nestjs/swagger';
import { CreateTemplateMessageDto } from './CreateTemplateMessage.dto';

export class UpdateTemplateMessageDto extends PartialType(CreateTemplateMessageDto) {}
