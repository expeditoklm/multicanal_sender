// dto/find-contact-by-email.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FindContactByEmailDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
