import { Optional } from '@nestjs/common';
import { IsBoolean, IsIBAN, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActivateCompanyDto {
  @IsNotEmpty()
  @IsInt()
  company_id: number;
}
