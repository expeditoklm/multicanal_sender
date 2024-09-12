// create-campaign.dto.ts
import { IsEnum, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsInt()
  user_id: number;

  @IsInt()
  company_id: number;
}
