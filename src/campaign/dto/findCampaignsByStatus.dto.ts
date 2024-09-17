import { CampaignStatus } from '@prisma/client'; // Importer l'Enum de Prisma
import { IsEnum } from 'class-validator';

export class FindCampaignsByStatusDto {



    @IsEnum(CampaignStatus, { message: 'Le statut doit être valide (pending, completed, cancelled).' })
  status: CampaignStatus;
}