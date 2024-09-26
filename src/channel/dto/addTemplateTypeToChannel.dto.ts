// dto/add-template-to-channel.dto.ts
import { IsNumber } from 'class-validator';

export class AddTemplateTypeToChannelDto {
  @IsNumber()
  templateTypeId: number;
}
