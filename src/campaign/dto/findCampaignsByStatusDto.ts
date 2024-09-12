import { CampaignStatus } from '@prisma/client'; // Importer l'Enum de Prisma

export class FindCampaignsByStatusDto {

    status: CampaignStatus; // pending, completed, cancelled
}