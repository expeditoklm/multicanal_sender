import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateCampaignDto } from './dto/createTemplateCampaignDto';
import { UpdateTemplateCampaignDto } from './dto/updateTemplateCampaignDto';
@Injectable()
export class TemplateCampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTemplateCampaignDto: CreateTemplateCampaignDto) {
    return this.prisma.templateCampaign.create({
      data: createTemplateCampaignDto,
    });
  }

  async findAll() {
    return this.prisma.templateCampaign.findMany({
      include: {
        message: true,
        template: true,
        campaign: true,
      },
    });
  }

  async findOne(id: number) {
    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
      include: {
        message: true,
        template: true,
        campaign: true,
      },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`TemplateCampaign with ID ${id} not found`);
    }

    return templateCampaign;
  }

  async update(id: number, updateTemplateCampaignDto: UpdateTemplateCampaignDto) {
    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`TemplateCampaign with ID ${id} not found`);
    }

    return this.prisma.templateCampaign.update({
      where: { id },
      data: updateTemplateCampaignDto,
    });
  }

  async remove(id: number) {
    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`TemplateCampaign with ID ${id} not found`);
    }

    return this.prisma.templateCampaign.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async findByCampaign(campaignId: number) {
    return this.prisma.templateCampaign.findMany({
      where: { campaign_id: campaignId, deleted: false },
      include: {
        template: true,
        message: true,
      },
    });
  }

  async findByTemplate(templateId: number) {
    return this.prisma.templateCampaign.findMany({
      where: { template_id: templateId, deleted: false },
      include: {
        campaign: true,
        message: true,
      },
    });
  }

  async previewTemplateCampaign(templateCampaignId: number) {
    const templateCampaign = await this.prisma.templateCampaign.findUnique({
      where: { id: templateCampaignId },
    });

    if (!templateCampaign) {
      throw new NotFoundException(`TemplateCampaign with ID ${templateCampaignId} not found`);
    }

    return templateCampaign;
  }




  // Obtenir les templates associés à une campagne spécifique
  async findTemplatesByCampaign(campaignId: number) {
    return this.prisma.templateCampaign.findMany({
      where: { campaign_id: campaignId, deleted: false },
      include: {
        template: true,
      },
    });
  }

  // Retirer un template d'une campagne
  async removeTemplateFromCampaign(templateId: number, campaignId: number) {
    const templateCampaign = await this.prisma.templateCampaign.findFirst({
      where: {
        template_id: templateId,
        campaign_id: campaignId,
        deleted: false,
      },
    });

    if (!templateCampaign) {
      throw new NotFoundException(
        `Template with ID ${templateId} not associated with Campaign ID ${campaignId}`
      );
    }

    // Met à jour la propriété `deleted` à true pour marquer comme supprimé
    return this.prisma.templateCampaign.update({
      where: { id: templateCampaign.id },
      data: { deleted: true },
    });
  }








}
