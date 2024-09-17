import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateTypeDto } from './dto/createTemplateType.dto';
import { UpdateTemplateTypeDto } from './dto/updateTemplateType.dto';

@Injectable()
export class TemplateTypeService {
  constructor(private readonly prisma: PrismaService) { }

  // Créer un nouveau TemplateType
  async create(createTemplateTypeDto: CreateTemplateTypeDto) {
    // Vérifier que le label est fourni
    if (!createTemplateTypeDto.label) {
      throw new BadRequestException('Le label est requis pour créer un TemplateType.');
    }

    // Vérifier si un TemplateType avec le même label existe déjà
    const existingTemplateType = await this.prisma.templateType.findFirst({
      where: { label: createTemplateTypeDto.label },
    });

    if (existingTemplateType) {
      throw new ConflictException('Un TemplateType avec ce label existe déjà.');
    }

    try {
      return await this.prisma.templateType.create({
        data: createTemplateTypeDto,
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création du TemplateType. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer tous les TemplateTypes
  async findAll() {
    try {
      return await this.prisma.templateType.findMany({
        include: {
          templates: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des TemplateTypes. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer un TemplateType par ID
  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateType doit être un nombre valide supérieur à zéro.');
    }

    const templateType = await this.prisma.templateType.findUnique({
      where: { id },
      include: {
        templates: true,
      },
    });

    if (!templateType) {
      throw new NotFoundException(`Aucun TemplateType trouvé avec l'ID ${id}.`);
    }

    return templateType;
  }

  // Mettre à jour un TemplateType
  async update(id: number, updateTemplateTypeDto: UpdateTemplateTypeDto) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateType doit être un nombre valide supérieur à zéro.');
    }

    const templateType = await this.prisma.templateType.findUnique({ where: { id } });

    if (!templateType) {
      throw new NotFoundException(`Aucun TemplateType trouvé avec l'ID ${id}.`);
    }

    // Vérifier si le label fourni est valide
    if (updateTemplateTypeDto.label && updateTemplateTypeDto.label.trim() === '') {
      throw new BadRequestException('Le label ne peut pas être une chaîne vide.');
    }

    try {
      return await this.prisma.templateType.update({
        where: { id },
        data: updateTemplateTypeDto,
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du TemplateType. Veuillez réessayer plus tard.');
    }
  }

  // Supprimer un TemplateType
  async remove(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du TemplateType doit être un nombre valide supérieur à zéro.');
    }

    const templateType = await this.prisma.templateType.findUnique({ where: { id } });

    if (!templateType) {
      throw new NotFoundException(`Aucun TemplateType trouvé avec l'ID ${id}.`);
    }

    try {
      return await this.prisma.templateType.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression du TemplateType. Veuillez réessayer plus tard.');
    }
  }
}
