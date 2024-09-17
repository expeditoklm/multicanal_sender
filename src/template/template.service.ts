import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) { }

  // Créer un nouveau Template
  // Créer un nouveau Template
  async create(createTemplateDto: CreateTemplateDto) {
    // Vérifier que les champs requis sont fournis
    if (!createTemplateDto.content) {
      throw new BadRequestException('Le champ "contenu" est requis pour créer un modèle.');
    }
    if (!createTemplateDto.template_type_id) {
      throw new BadRequestException('L\'ID du type de modèle est requis pour créer un modèle.');
    }
    if (!createTemplateDto.channel_id) {
      throw new BadRequestException('L\'ID du canal est requis pour créer un modèle.');
    }

    // Vérifier la validité des IDs
    if (isNaN(createTemplateDto.template_type_id) || createTemplateDto.template_type_id <= 0) {
      throw new BadRequestException('L\'ID du type de modèle doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(createTemplateDto.channel_id) || createTemplateDto.channel_id <= 0) {
      throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier si le type de modèle existe
    const templateTypeExists = await this.prisma.templateType.findUnique({
      where: { id: createTemplateDto.template_type_id },
    });

    if (!templateTypeExists) {
      throw new NotFoundException(`Le type de modèle avec l'ID ${createTemplateDto.template_type_id} n'existe pas.`);
    }

    // Vérifier si le canal existe
    const channelExists = await this.prisma.channel.findUnique({
      where: { id: createTemplateDto.channel_id },
    });

    if (!channelExists) {
      throw new NotFoundException(`Le canal avec l'ID ${createTemplateDto.channel_id} n'existe pas.`);
    }

    // Vérifier si un modèle avec les mêmes détails existe déjà
    const existingTemplate = await this.prisma.template.findFirst({
      where: {
        content: createTemplateDto.content,
        template_type_id: createTemplateDto.template_type_id,
        channel_id: createTemplateDto.channel_id,
      },
    });

    if (existingTemplate) {
      throw new ConflictException('Un modèle avec les mêmes détails existe déjà.');
    }

    return this.prisma.template.create({
      data: createTemplateDto,
    });
  }
  // Récupérer tous les Templates
  async findAll() {
    try {
      return await this.prisma.template.findMany({
        include: {
          templateType: true,
          channel: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des modèles. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer un Template par ID
  async findOne(id: number) {
    // Vérifier la validité de l'ID
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        templateType: true,
        channel: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
    }

    // Vérifier si le modèle est marqué comme supprimé
    if (template.deleted) {
      throw new NotFoundException(`Le modèle avec l'ID ${id} a été supprimé.`);
    }

    return template;
  }

  // Mettre à jour un Template
  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    // Vérifier la validité de l'ID
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({ where: { id } });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
    }

    if (template.deleted) {
      throw new BadRequestException(`Le modèle avec l'ID ${id} a été supprimé et ne peut pas être mis à jour.`);
    }

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
    // Vérifier la validité de l'ID
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({ where: { id } });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
    }

    if (template.deleted) {
      throw new BadRequestException(`Le modèle avec l'ID ${id} a déjà été supprimé.`);
    }

    return this.prisma.template.delete({ where: { id } });
  }

  // Appliquer un template à une campagne
  async applyTemplateToCampaign(templateId: number, campaignId: number) {
    // Vérifier la validité des IDs
    if (isNaN(templateId) || templateId <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    if (isNaN(campaignId) || campaignId <= 0) {
      throw new BadRequestException('L\'ID de la campagne doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({ where: { id: templateId } });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId}.`);
    }

    if (template.deleted) {
      throw new BadRequestException(`Le modèle avec l'ID ${templateId} a été supprimé et ne peut pas être appliqué à une campagne.`);
    }

    // Logique pour appliquer le modèle à la campagne
    // Ajoute ici la logique pour associer le modèle à la campagne,
    // par exemple en créant une entrée dans une table de relation

    return `Le modèle avec l'ID ${templateId} a été appliqué à la campagne avec l'ID ${campaignId}.`;
  }

  // Prévisualiser un template
  async previewTemplate(templateId: number) {
    // Vérifier la validité de l'ID
    if (isNaN(templateId) || templateId <= 0) {
      throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
    }

    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId}.`);
    }

    if (template.deleted) {
      throw new BadRequestException(`Le modèle avec l'ID ${templateId} a été supprimé et ne peut pas être prévisualisé.`);
    }

    return {
      id: template.id,
      name: template.name,
      content: template.content,
      template_type_id: template.template_type_id,
      channel_id: template.channel_id,
    };
  }
}
