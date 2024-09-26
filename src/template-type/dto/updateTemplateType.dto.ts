import { IsString, IsBoolean, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateTemplateTypeDto {
  @IsOptional()
  @IsString()
  label?: string;


  @IsInt()
  @IsNotEmpty()
  channel_id?: number;
}
