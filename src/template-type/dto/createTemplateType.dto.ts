import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTemplateTypeDto {
  @IsInt()
  @IsNotEmpty()
  channel_id: number;

  @IsString()
  @IsNotEmpty()
  label: string;
}
