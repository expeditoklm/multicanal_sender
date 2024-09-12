import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';


export class GetCompanyByUserDto {
    @IsNumber({}, { message: 'userId must be a number' })
    userId: number;
  }