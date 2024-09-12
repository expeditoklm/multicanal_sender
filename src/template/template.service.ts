import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/createTemplateDto';
import { UpdateTemplateDto } from './dto/updateTemplateDto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un nouveau Template
  async create(createTemplateDto: CreateTemplateDto) {
    return this.prisma.template.create({
      data: createTemplateDto,
    });
  }

  // Récupérer tous les Templates
  async findAll() {
    return this.prisma.template.findMany({
      include: {
        templateType: true,
        channel: true,
      },
    });
  }

  // Récupérer un Template par ID
  async findOne(id: number) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        templateType: true,
        channel: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  // Mettre à jour un Template
  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    const template = await this.prisma.template.findUnique({ where: { id } });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return this.prisma.template.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  // Supprimer un Template
  async remove(id: number) {
    return this.prisma.template.delete({ where: { id } });
  }




  // Appliquer un template à une campagne
  async applyTemplateToCampaign(templateId: number, campaignId: number) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Logique pour appliquer le template à la campagne
    // Ajoute ici la logique pour associer le template à la campagne,
    // par exemple en créant une entrée dans une table de relation

    return `Template with ID ${templateId} applied to campaign with ID ${campaignId}`;
  }

  // Prévisualiser un template
  async previewTemplate(templateId: number) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Retourner le contenu du template pour prévisualisation
    return {
      id: template.id,
      name: template.name,
      content: template.content,
      template_type_id: template.template_type_id,
      channel_id: template.channel_id,
    };
  }


















}
