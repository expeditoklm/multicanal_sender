import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly link_fb: string;

  @IsOptional()
  @IsString()
  readonly link_tiktok: string;

  @IsOptional()
  @IsString()
  readonly secondary_color: string;

  @IsOptional()
  @IsString()
  readonly primary_color: string;

  @IsOptional()
  @IsString()
  readonly tertiary_color: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly whatsapp: string;

  @IsOptional()
  @IsString()
  readonly location: string;


  @IsOptional()
  @IsString()
  readonly link: string;

  @IsOptional()
  @IsString()
  readonly link_insta: string;

  @IsOptional()
  @IsString()
  readonly link_pinterest: string;

  @IsOptional()
  @IsString()
  readonly link_twit: string;

  @IsOptional()
  @IsString()
  readonly link_youtube: string;

  @IsOptional()
  @IsString()
  readonly isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly deleted?: boolean;
}
