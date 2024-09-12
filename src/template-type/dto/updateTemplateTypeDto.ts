import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTemplateTypeDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
