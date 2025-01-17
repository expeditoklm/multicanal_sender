import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  content: string;

  @IsInt()
  template_type_id: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
