import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateCampaignDto } from './dto/createTemplateCampaign.dto';
import { UpdateTemplateCampaignDto } from './dto/updateTemplateCampaign.dto';

@Injectable()
export class TemplateCampaignService {
  constructor(private readonly prisma: PrismaService) { }

  // Vérifie la validité de l'ID d'une entité
  private async validateId(entityName: string, id: number, type: 'template' | 'message' | 'campaign') {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`L'ID du ${entityName} est invalide. Veuillez fournir un ID numérique valide supérieur à zéro.`);
    }

    let entity;
    switch (type) {
      case 'template':
        entity = await this.prisma.template.findUnique({ where: { id } });
        break;
      case 'message':
        entity = await this.prisma.message.findUnique({ where: { id } });
        break;
      case 'campaign':
        entity = await this.prisma.campaign.findUnique({ where: { id } });
        break;
      default:
        throw new InternalServerErrorException('Type d\'entité non pris en charge.');
    }

    if (!entity) {
      throw new NotFoundException(`Aucun ${entityName} trouvé avec l'ID ${id}.`);
    }

    if (entity.deleted) {
      throw new BadRequestException(`Le ${entityName} avec l'ID ${id} a été supprimé et ne peut pas être utilisé.`);
    }

    return entity;
  }

  async create(createTemplateCampaignDto: CreateTemplateCampaignDto) {
    const { message_id, template_id, campaign_id } = createTemplateCampaignDto;

    // Validation des IDs
    await this.validateId('message', message_id, 'message');
    await this.validateId('template', template_id, 'template');
    await this.validateId('campaign', campaign_id, 'campaign');

    try {
      return await this.prisma.templateCampaign.create({
        data: createTemplateCampaignDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la création du TemplateCampaign. Veuillez réessayer plus tard.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.templateCampaign.findMany({
        include: {
          message: true,
          template: true,
          campaign: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des TemplateCampaigns. Veuillez réessayer plus tard.');
    }
  }

  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateCampaign est invalide. Veuillez fournir un ID numérique valide supérieur à zéro.');
    }

    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
      include: {
        message: true,
        template: true,
        campaign: true,
      },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`Aucun TemplateCampaign trouvé avec l'ID ${id}.`);
    }

    if (templateCampaign.deleted) {
      throw new NotFoundException(`Le TemplateCampaign avec l'ID ${id} a été supprimé.`);
    }

    return templateCampaign;
  }

  async update(id: number, updateTemplateCampaignDto: UpdateTemplateCampaignDto) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateCampaign est invalide. Veuillez fournir un ID numérique valide supérieur à zéro.');
    }

    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`Aucun TemplateCampaign trouvé avec l'ID ${id}.`);
    }

    if (templateCampaign.deleted) {
      throw new NotFoundException(`Le TemplateCampaign avec l'ID ${id} a été supprimé.`);
    }

    try {
      return await this.prisma.templateCampaign.update({
        where: { id },
        data: updateTemplateCampaignDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la mise à jour du TemplateCampaign. Veuillez réessayer plus tard.');
    }
  }

  async remove(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateCampaign est invalide. Veuillez fournir un ID numérique valide supérieur à zéro.');
    }

    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`Aucun TemplateCampaign trouvé avec l'ID ${id}.`);
    }

    if (templateCampaign.deleted) {
      throw new NotFoundException(`Le TemplateCampaign avec l'ID ${id} a déjà été supprimé.`);
    }

    try {
      return await this.prisma.templateCampaign.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du TemplateCampaign. Veuillez réessayer plus tard.');
    }
  }

  async findByCampaign(campaignId: number) {
    await this.validateId('campaign', campaignId, 'campaign');

    try {
      return await this.prisma.templateCampaign.findMany({
        where: { campaign_id: campaignId, deleted: false },
        include: {
          template: true,
          message: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des TemplateCampaigns pour la campagne spécifiée. Veuillez réessayer plus tard.');
    }
  }

  async findByTemplate(templateId: number) {
    await this.validateId('template', templateId, 'template');

    try {
      return await this.prisma.templateCampaign.findMany({
        where: { template_id: templateId, deleted: false },
        include: {
          campaign: true,
          message: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des TemplateCampaigns pour le template spécifié. Veuillez réessayer plus tard.');
    }
  }

  async previewTemplateCampaign(templateCampaignId: number) {
    if (isNaN(templateCampaignId) || templateCampaignId <= 0) {
      throw new BadRequestException('L\'ID du TemplateCampaign est invalide. Veuillez fournir un ID numérique valide supérieur à zéro.');
    }

    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id: templateCampaignId },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`Aucun TemplateCampaign trouvé avec l'ID ${templateCampaignId}.`);
    }

    if (templateCampaign.deleted) {
      throw new NotFoundException(`Le TemplateCampaign avec l'ID ${templateCampaignId} a été supprimé.`);
    }

    return templateCampaign;
  }

  async findTemplatesByCampaign(campaignId: number) {
    await this.validateId('campaign', campaignId, 'campaign');

    try {
      return await this.prisma.templateCampaign.findMany({
        where: { campaign_id: campaignId, deleted: false },
        include: {
          template: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des templates associés à la campagne spécifiée. Veuillez réessayer plus tard.');
    }
  }

  async removeTemplateFromCampaign(templateId: number, campaignId: number) {
    await this.validateId('template', templateId, 'template');
    await this.validateId('campaign', campaignId, 'campaign');

    const templateCampaign = await this.prisma.templateCampaign.findFirst({
      where: {
        template_id: templateId,
        campaign_id: campaignId,
        deleted: false,
      },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`Le template avec l'ID ${templateId} n'est pas associé à la campagne avec l'ID ${campaignId}.`);
    }

    try {
      return await this.prisma.templateCampaign.update({
        where: { id: templateCampaign.id },
        data: { deleted: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors du retrait du template de la campagne. Veuillez réessayer plus tard.');
    }
  }
}
