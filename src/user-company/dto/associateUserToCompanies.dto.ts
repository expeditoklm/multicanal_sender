import { IsArray, IsInt, IsOptional, ArrayNotEmpty } from 'class-validator';

export class AssociateUserToCompaniesDto {
  @IsInt()
  userId: number;

  @IsArray()
  // @ArrayNotEmpty()
  @IsInt({ each: true })
  companyIds: number[];
}