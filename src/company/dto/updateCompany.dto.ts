import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    readonly name?: string;
  
    @IsOptional()
    @IsString()
    readonly description?: string;
  
    @IsOptional()
    @IsString()
    readonly link_fb?: string;
  
    @IsOptional()
    @IsString()
    readonly link_tiktok?: string;
  
    @IsOptional()
    @IsString()
    readonly secondary_color?: string;
  
    @IsOptional()
    @IsString()
    readonly primary_color?: string;
  
    @IsOptional()
    @IsString()
    readonly tertiary_color?: string;
  
    @IsOptional()
    @IsString()
    readonly phone?: string;
  
    @IsOptional()
    @IsString()
    readonly whatsapp?: string;
  
    @IsOptional()
    @IsString()
    readonly location?: string;
  
    @IsOptional()
    @IsBoolean()
    readonly deleted?: boolean;
  }