// dto/update-audience.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './createMessageDto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
