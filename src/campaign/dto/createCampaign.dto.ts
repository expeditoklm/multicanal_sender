// create-campaign.dto.ts
import { IsEnum, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { CampaignStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @IsString({ message: 'Le nom de la campagne doit être une chaîne de caractères.' })
  name: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La date de début doit être une date valide.' })
  start_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La date de fin doit être une date valide.' })
  end_date?: Date;

  @IsEnum(CampaignStatus, { message: 'Le statut doit être valide (pending, completed, cancelled).' })
  status: CampaignStatus;



  @IsInt({ message: 'L\'identifiant de l\'entreprise doit être un entier.' })
  company_id: number;
}

