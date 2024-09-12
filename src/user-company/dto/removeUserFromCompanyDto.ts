import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class RemoveUserFromCompanyDto {
    @IsNumber({}, { message: 'userId must be a number' })
    userId: number;

    @IsNumber({}, { message: 'companyId must be a number' })
    companyId: number;
  }