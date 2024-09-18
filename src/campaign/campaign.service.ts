// campaign.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { UpdateCampaignDto } from './dto/updateCampaign.dto';
import { ExtendCampaignDto } from './dto/extendCampaign.dto';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignService {
    constructor(private readonly prisma: PrismaService) { }

    // Créer une campagne
    async create(createCampaignDto: CreateCampaignDto) {
        if (!createCampaignDto.name) {
            throw new HttpException('Le nom de la campagne est requis.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.create({
                data: {
                    ...createCampaignDto,
                    status: CampaignStatus.PENDING,
                },
            });
            return { message: 'Campagne créée avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new HttpException('Une campagne avec ce nom existe déjà.', HttpStatus.CONFLICT);
            }
            if (error.message.includes('Invalid data')) {
                throw new HttpException('Données invalides pour la création de la campagne.', HttpStatus.BAD_REQUEST);
            }
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            throw new HttpException('Erreur inconnue lors de la création de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Trouver toutes les campagnes
    async findAll() {
        try {
            const campaigns = await this.prisma.campaign.findMany({
                where: { deleted: false },
            });
            if (campaigns.length === 0) {
                return { message: 'Aucune campagne active trouvée.' };

            }
            return { message: 'Campagnes récupérées avec succès', campaigns };
        } catch (error) {
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            if (error.message.includes('Permission denied')) {
                throw new HttpException('Accès refusé aux campagnes.', HttpStatus.FORBIDDEN);
            }
            throw new HttpException('Erreur lors de la récupération des campagnes.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Trouver une campagne par ID
    async findOne(id: number) {
        if (!id) {
            throw new HttpException('L\'identifiant de la campagne est requis.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.findFirst({
                where: { id, deleted: false },
            });
            if (!campaign) {
                return 'Campagne introuvable. Vérifiez l’identifiant.';
            }
            return { message: 'Campagne trouvée avec succès', campaign };
        } catch (error) {
            if (error.message.includes('Invalid ID')) {
                throw new HttpException('L\'identifiant de la campagne est invalide.', HttpStatus.BAD_REQUEST);
            }
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            throw new HttpException('Erreur lors de la recherche de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mettre à jour une campagne
    async update(id: number, updateCampaignDto: UpdateCampaignDto) {
        if (!id) {
            throw new HttpException('L\'identifiant de la campagne est requis.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.updateMany({
                where: { id, deleted: false },
                data: { ...updateCampaignDto, status: updateCampaignDto.status || undefined },
            });
            if (campaign.count === 0) {
                return 'Campagne introuvable. Impossible de mettre à jour.';
            }
            return { message: 'Campagne mise à jour avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Campagne introuvable pour la mise à jour.', HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Unique constraint')) {
                throw new HttpException('Violation de contrainte unique lors de la mise à jour.', HttpStatus.CONFLICT);
            }
            if (error.message.includes('Invalid data')) {
                throw new HttpException('Données invalides pour la mise à jour.', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Erreur inconnue lors de la mise à jour de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Supprimer (désactiver) une campagne
    async remove(id: number) {
        if (!id) {
            throw new HttpException('L\'identifiant de la campagne est requis pour la suppression.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.update({
                where: { id },
                data: { deleted: true },
            });
            return { message: 'Campagne supprimée avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Campagne introuvable pour suppression.', HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Cannot delete')) {
                throw new HttpException('Impossible de supprimer la campagne. Elle pourrait être liée à d\'autres entités.', HttpStatus.CONFLICT);
            }
            throw new HttpException('Erreur lors de la suppression de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Trouver toutes les campagnes d'un utilisateur
    async findCampaignsByUser(userId: number) {
        if (!userId) {
            throw new HttpException('L\'identifiant de l\'utilisateur est requis.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaigns = await this.prisma.campaign.findMany({
                where: { user_id: userId, deleted: false },
            });
            if (campaigns.length === 0) {
                return 'Aucune campagne trouvée pour cet utilisateur.';
            }
            return { message: 'Campagnes de l’utilisateur récupérées avec succès', campaigns };
        } catch (error) {
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            if (error.message.includes('Permission denied')) {
                throw new HttpException('Accès refusé aux campagnes de l’utilisateur.', HttpStatus.FORBIDDEN);
            }
            throw new HttpException('Erreur lors de la récupération des campagnes de l’utilisateur.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Filtrer les campagnes par statut
    async findCampaignsByStatus(status: CampaignStatus) {
        if (!status) {
            throw new HttpException('Le statut de la campagne est requis pour le filtrage.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaigns = await this.prisma.campaign.findMany({
                where: { status, deleted: false },
            });
            if (campaigns.length === 0) {
                return 'Aucune campagne trouvée pour ce statut.';
            }
            return { message: 'Campagnes récupérées avec succès', campaigns };
        } catch (error) {
            if (error.message.includes('Invalid status')) {
                throw new HttpException('Statut de campagne invalide.', HttpStatus.BAD_REQUEST);
            }
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            throw new HttpException('Erreur lors du filtrage des campagnes.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Prolonger la durée d'une campagne
    async extendCampaign(campaignId: number, newEndDate: Date) {
        if (!campaignId) {
            throw new HttpException('L\'identifiant de la campagne est requis pour prolonger.', HttpStatus.BAD_REQUEST);
        }
        if (!newEndDate) {
            throw new HttpException('La nouvelle date de fin est requise pour prolonger la campagne.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.update({
                where: { id: campaignId, deleted: false },
                data: { end_date: newEndDate },
            });
            return { message: 'Campagne prolongée avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Campagne introuvable pour prolongation.', HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Invalid date')) {
                throw new HttpException('La date de fin fournie est invalide.', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Erreur lors de la prolongation de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Annuler une campagne
    async cancelCampaign(campaignId: number) {
        if (!campaignId) {
            throw new HttpException('L\'identifiant de la campagne est requis pour l\'annulation.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.update({
                where: { id: campaignId, deleted: false },
                data: { status: CampaignStatus.CANCELLED, deleted: true },
            });
            return { message: 'Campagne annulée avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Campagne introuvable pour annulation.', HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            throw new HttpException('Erreur lors de l’annulation de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Marquer une campagne comme terminée
    async completeCampaign(campaignId: number) {
        if (!campaignId) {
            throw new HttpException('L\'identifiant de la campagne est requis pour la clôture.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaign = await this.prisma.campaign.update({
                where: { id: campaignId, deleted: false },
                data: { status: CampaignStatus.COMPLETED },
            });
            return { message: 'Campagne terminée avec succès', campaign };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Campagne introuvable pour clôture.', HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Invalid status')) {
                throw new HttpException('Le statut de la campagne est invalide pour la clôture.', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Erreur lors de la clôture de la campagne.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Trouver les campagnes d'une entreprise
    async findCampaignsByCompany(companyId: number) {
        if (!companyId) {
            throw new HttpException('L\'identifiant de l\'entreprise est requis.', HttpStatus.BAD_REQUEST);
        }

        try {
            const campaigns = await this.prisma.campaign.findMany({
                where: { company_id: companyId, deleted: false },
            });
            if (campaigns.length === 0) {
                return 'Aucune campagne trouvée pour cette entreprise.';
            }
            return { message: 'Campagnes de l’entreprise récupérées avec succès', campaigns };
        } catch (error) {
            if (error.message.includes('Database connection')) {
                throw new HttpException('Problème de connexion à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
            }
            if (error.message.includes('Permission denied')) {
                throw new HttpException('Accès refusé aux campagnes de l’entreprise.', HttpStatus.FORBIDDEN);
            }
            throw new HttpException('Erreur lors de la récupération des campagnes de l’entreprise.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
