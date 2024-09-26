import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un nouveau Template
  async create(createTemplateDto: CreateTemplateDto) {
    // Vérification des champs obligatoires
    const { content, template_type_id, channel_id } = createTemplateDto;

    if (!content) {
      throw new BadRequestException('Le champ "contenu" est requis pour créer un modèle.');
    }
    if (!template_type_id) {
      throw new BadRequestException('L\'ID du type de modèle est requis pour créer un modèle.');
    }
    if (!channel_id) {
      throw new BadRequestException('L\'ID du canal est requis pour créer un modèle.');
    }

    // Validation des IDs
    if (isNaN(template_type_id) || template_type_id <= 0) {
      throw new BadRequestException('L\'ID du type de modèle doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(channel_id) || channel_id <= 0) {
      throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence du type de modèle
    const templateTypeExists = await this.prisma.templateType.findUnique({
      where: { id: template_type_id },
    });

    if (!templateTypeExists) {
      throw new NotFoundException(`Le type de modèle avec l'ID ${template_type_id} n'existe pas.`);
    }

    // Vérifier l'existence du canal
    const channelExists = await this.prisma.channel.findUnique({
      where: { id: channel_id },
    });

    if (!channelExists) {
      throw new NotFoundException(`Le canal avec l'ID ${channel_id} n'existe pas.`);
    }

    // Vérifier la duplication du modèle
    const existingTemplate = await this.prisma.template.findFirst({
      where: {
        content: createTemplateDto.content,
        template_type_id: createTemplateDto.template_type_id,
        deleted: false,  // S'assurer que ce n'est pas un modèle supprimé
      },
    });

    if (existingTemplate) {
      throw new ConflictException('Un modèle avec les mêmes détails existe déjà.');
    }

    // Création du modèle
    return this.prisma.template.create({
      data: {
        name: createTemplateDto.name,
        content: createTemplateDto.content,
        template_type_id,
      },
    });
  }

  // Récupérer tous les Templates
  async findAll() {
    try {
      return await this.prisma.template.findMany({
        where: { deleted: false },  // Ne retourner que les modèles non supprimés
        include: {
          templateType: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des modèles.');
    }
  }

  // Récupérer un Template par ID
  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        templateType: true,
      },
    });

    if (!template || template.deleted) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
    }

    return template;
  }

  // Mettre à jour un Template
  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
    }

    if (template.deleted) {
      throw new BadRequestException('Ce modèle a été supprimé et ne peut pas être mis à jour.');
    }

    // Valider le type de modèle et le canal si fournis
    if (updateTemplateDto.template_type_id && (isNaN(updateTemplateDto.template_type_id) || updateTemplateDto.template_type_id <= 0)) {
      throw new BadRequestException('L\'ID du type de modèle doit être un nombre valide supérieur à zéro.');
    }
    if (updateTemplateDto.channel_id && (isNaN(updateTemplateDto.channel_id) || updateTemplateDto.channel_id <= 0)) {
      throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
    }

    return this.prisma.template.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  // Supprimer un Template
  async remove(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template || template.deleted) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id} ou il est déjà supprimé.`);
    }

    return this.prisma.template.update({
      where: { id },
      data: { deleted: true },
    });
  }

  // Appliquer un template à une campagne
  async applyTemplateToCampaign(templateId: number, campaignId: number) {
    if (isNaN(templateId) || templateId <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    if (isNaN(campaignId) || campaignId <= 0) {
      throw new BadRequestException('L\'ID de la campagne doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template || template.deleted) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId} ou il a été supprimé.`);
    }

    // Logique d'application du modèle à la campagne
    return `Le modèle avec l'ID ${templateId} a été appliqué à la campagne avec l'ID ${campaignId}.`;
  }

  // Prévisualiser un template
  async previewTemplate(templateId: number) {
    if (isNaN(templateId) || templateId <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template || template.deleted) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId} ou il a été supprimé.`);
    }

    return {
      id: template.id,
      name: template.name,
      content: template.content,
      template_type_id: template.template_type_id,
    };
  }
}
