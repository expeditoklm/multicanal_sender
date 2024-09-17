import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTemplateCampaignDto {
  @IsOptional()
  @IsInt()
  message_id?: number;

  @IsOptional()
  @IsInt()
  template_id?: number;

  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  btn_txt?: string;

  @IsOptional()
  @IsString()
  btn_link?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
