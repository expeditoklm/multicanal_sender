// dto/create-audience.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAudienceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
