import { IsArray, IsInt, IsOptional, ArrayNotEmpty } from 'class-validator';

export class AssociateUserToCompanyDto {
  @IsInt()
  companyId: number;
}