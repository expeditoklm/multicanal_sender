import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  template_type_id?: number;

  @IsOptional()
  @IsInt()
  channel_id?: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
