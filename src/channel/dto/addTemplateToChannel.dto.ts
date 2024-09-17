// dto/add-template-to-channel.dto.ts
import { IsNumber } from 'class-validator';

export class AddTemplateToChannelDto {
  @IsNumber()
  templateId: number;
}
