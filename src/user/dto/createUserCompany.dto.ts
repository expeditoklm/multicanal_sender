// dto/create-user-company.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserCompanyDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  company_id: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isMember?: boolean;
}