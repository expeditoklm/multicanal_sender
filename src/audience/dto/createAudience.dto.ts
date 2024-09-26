// dto/create-audience.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAudienceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
