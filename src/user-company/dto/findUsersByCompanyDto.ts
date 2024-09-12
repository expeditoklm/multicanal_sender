import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, isInt, IsNumber } from 'class-validator';

export class FindUsersByCompanyDto {

    @IsNumber({}, { message: 'companyId must be a number' })
    companyId: number;
  }