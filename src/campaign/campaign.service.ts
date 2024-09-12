import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { UpdateCampaignDto } from './dto/updateCampaignDto';
import { ExtendCampaignDto } from './dto/extendCampaignDto'; // DTO pour prolonger la campagne
import { CampaignStatus } from '@prisma/client'; // Importer l'Enum de Prisma

@Injectable()
export class CampaignService {
    constructor(private readonly prisma: PrismaService) {}

    create(createCampaignDto: CreateCampaignDto) {
        return this.prisma.campaign.create({
            data: {
                ...createCampaignDto,
                status: CampaignStatus.PENDING,
            },
        });
    }

    findAll() {
        return this.prisma.campaign.findMany({
            where: {
                deleted: false,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.campaign.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
    }

    update(id: number, updateCampaignDto: UpdateCampaignDto) {
        return this.prisma.campaign.updateMany({
            where: {
                id,
                deleted: false,
            },
            data: {
                ...updateCampaignDto,
                status: updateCampaignDto.status || undefined,
            },
        });
    }

    remove(id: number) {
        return this.prisma.campaign.update({
            where: { id },
            data: {
                deleted: true,
            },
        });
    }

    // Obtenir toutes les campagnes créées par un utilisateur donné
    findCampaignsByUser(userId: number) {
        return this.prisma.campaign.findMany({
            where: {
                user_id: userId,
                deleted: false,
            },
        });
    }

    // Filtrer les campagnes par statut (en cours, terminé, annulé)
    findCampaignsByStatus(status: CampaignStatus) {
        return this.prisma.campaign.findMany({
            where: {
                status,
                deleted: false,
            },
        });
    }

    // Prolonger la durée d'une campagne
    extendCampaign(campaignId: number, newEndDate: Date) {
        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: {
                end_date: newEndDate,
            },
        });
    }

    // Annuler une campagne
    cancelCampaign(campaignId: number) {
        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: CampaignStatus.CANCELLED,
            },
        });
    }

    // Obtenir toutes les campagnes liées à une entreprise
    findCampaignsByCompany(companyId: number) {
        return this.prisma.campaign.findMany({
            where: {
                company_id: companyId,
                deleted: false,
            },
        });
    }
}
