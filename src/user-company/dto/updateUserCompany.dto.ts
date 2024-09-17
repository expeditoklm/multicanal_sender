import { IsArray, IsInt, IsOptional, ArrayNotEmpty } from 'class-validator';

export class UpdateUserCompanyDto {
    @IsInt()
    userId: number;
  
    @IsInt()
    newCompanyId: number;
  
    @IsOptional()
    @IsInt()
    oldCompanyId?: number;
  }