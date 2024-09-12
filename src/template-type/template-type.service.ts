import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateTypeDto } from './dto/createTemplateTypeDto';
import { UpdateTemplateTypeDto } from './dto/updateTemplateTypeDto';
@Injectable()
export class TemplateTypeService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un nouveau TemplateType
  async create(createTemplateTypeDto: CreateTemplateTypeDto) {
    return this.prisma.templateType.create({
      data: createTemplateTypeDto,
    });
  }

  // Récupérer tous les TemplateTypes
  async findAll() {
    return this.prisma.templateType.findMany({
      include: {
        templates: true,
      },
    });
  }

  // Récupérer un TemplateType par ID
  async findOne(id: number) {
    const templateType = await this.prisma.templateType.findUnique({
      where: { id },
      include: {
        templates: true,
      },
    });

    if (!templateType) {
      throw new NotFoundException(`TemplateType with ID ${id} not found`);
    }

    return templateType;
  }

  // Mettre à jour un TemplateType
  async update(id: number, updateTemplateTypeDto: UpdateTemplateTypeDto) {
    const templateType = await this.prisma.templateType.findUnique({ where: { id } });

    if (!templateType) {
      throw new NotFoundException(`TemplateType with ID ${id} not found`);
    }

    return this.prisma.templateType.update({
      where: { id },
      data: updateTemplateTypeDto,
    });
  }

  // Supprimer un TemplateType
  async remove(id: number) {
    return this.prisma.templateType.delete({ where: { id } });
  }
}
