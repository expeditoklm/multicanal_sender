import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTemplateTypeDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
