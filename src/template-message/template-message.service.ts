import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateMessageDto } from './dto/CreateTemplateMessage.dto';
import { UpdateTemplateMessageDto } from './dto/UpdateTemplateMessage.dto';

@Injectable()
export class TemplateMessageService {
    constructor(private readonly prisma: PrismaService) {}

    // Créer un TemplateMessage// Créer un TemplateMessage
    async create(data: CreateTemplateMessageDto, userId: number) {
        // Vérifier si le message existe
        const message = await this.prisma.message.findUnique({
            where: { id: data.message_id },
        });
        if (!message) {
            throw new NotFoundException(`Le message avec l'ID ${data.message_id} est introuvable.`);
        }
        if (message.deleted) {
            throw new BadRequestException(`Le message avec l'ID ${data.message_id} a été supprimé et ne peut pas être utilisé.`);
        }

        // Vérifier si le template existe
        const template = await this.prisma.template.findUnique({
            where: { id: data.template_id },
        });
        if (!template) {
            throw new NotFoundException(`Le template avec l'ID ${data.template_id} est introuvable.`);
        }
        if (template.deleted) {
            throw new BadRequestException(`Le template avec l'ID ${data.template_id} a été supprimé et ne peut pas être utilisé.`);
        }

        // Vérifier l'existence de l'utilisateur dans la compagnie
        const campaign = await this.prisma.campaign.findFirst({
            where: { id: message.campaign_id },
        });
        if (!campaign) {
            throw new NotFoundException(`La campagne associée au message est introuvable.`);
        }

        const userIsInCompany = await this.prisma.userCompany.findFirst({
            where: {
                company_id: campaign.company_id,
                user_id: userId,
            },
        });

        if (!userIsInCompany) {
            throw new BadRequestException('Vous ne pouvez pas personnaliser ce template pour cette compagnie.');
        }

        // Vérifier si une association message-template existe déjà
        const existingTemplateMessage = await this.prisma.templateMessage.findFirst({
            where: {
                message_id: data.message_id,
                template_id: data.template_id,
            },
        });
        if (existingTemplateMessage) {
            throw new ConflictException(`Une association entre le message et le template existe déjà.`);
        }

        try {
            return await this.prisma.templateMessage.create({ data });
        } catch (error) {
            throw new ConflictException('Erreur de création du template message. Veuillez vérifier les données.');
        }
    }
    // Trouver tous les TemplateMessages
    async findAll() {
        try {
            return await this.prisma.templateMessage.findMany();
        } catch (error) {
            throw new BadRequestException(`Impossible de récupérer les TemplateMessages. Veuillez réessayer plus tard.`);
        }
    }

    // Trouver un TemplateMessage par son ID
    async findOne(id: number) {
        // Vérifier si le TemplateMessage existe
        const templateMessage = await this.prisma.templateMessage.findUnique({ where: { id } });
        if (!templateMessage) {
            throw new NotFoundException(`Le TemplateMessage avec l'ID ${id} est introuvable.`);
        }

        // Vérifier si le TemplateMessage a été supprimé
        if (templateMessage.deleted) {
            throw new BadRequestException(`Le TemplateMessage avec l'ID ${id} a été supprimé et ne peut pas être consulté.`);
        }

        try {
            return templateMessage;
        } catch (error) {
            throw new BadRequestException(`Erreur lors de la récupération du TemplateMessage avec l'ID ${id}.`);
        }
    }

    // Mettre à jour un TemplateMessage
    async update(id: number, data: UpdateTemplateMessageDto) {
        // Vérifier si le TemplateMessage existe
        const templateMessage = await this.findOne(id);
        if (!templateMessage) {
            throw new NotFoundException(`Impossible de mettre à jour. Le TemplateMessage avec l'ID ${id} est introuvable.`);
        }

        // Vérifier si le TemplateMessage a été supprimé
        if (templateMessage.deleted) {
            throw new BadRequestException(`Le TemplateMessage avec l'ID ${id} a été supprimé et ne peut pas être mis à jour.`);
        }

        try {
            return await this.prisma.templateMessage.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw new BadRequestException(`Erreur lors de la mise à jour du TemplateMessage avec l'ID ${id}.`);
        }
    }

    // Supprimer un TemplateMessage
    async remove(id: number) {
        // Vérifier si le TemplateMessage existe
        const templateMessage = await this.findOne(id);
        if (!templateMessage) {
            throw new NotFoundException(`Impossible de supprimer. Le TemplateMessage avec l'ID ${id} est introuvable.`);
        }

        // Vérifier si le TemplateMessage a déjà été supprimé
        if (templateMessage.deleted) {
            throw new BadRequestException(`Le TemplateMessage avec l'ID ${id} est déjà supprimé.`);
        }

        try {
            return await this.prisma.templateMessage.delete({ where: { id } });
        } catch (error) {
            throw new BadRequestException(`Erreur lors de la suppression du TemplateMessage avec l'ID ${id}.`);
        }
    }
}
