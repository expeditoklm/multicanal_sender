// dto/create-audience.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateAudienceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
