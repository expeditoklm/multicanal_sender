import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/createCompanyDto ';
import { UpdateCompanyDto } from './dto/updateCompanyDto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      if (!createCompanyDto.name) {
        throw new BadRequestException('Le nom est requis.');
      }

      const existingCompany = await this.prismaService.company.findFirst({
        where: { name: createCompanyDto.name },
      });

      if (existingCompany) {
        throw new ConflictException('Une entreprise avec ce nom existe déjà.');
      }

      return await this.prismaService.company.create({
        data: createCompanyDto,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Les données fournies sont incorrectes.');
      } else if (error instanceof ConflictException) {
        throw new ConflictException('Conflit détecté lors de la création de l\'entreprise.');
      } else {
        throw new InternalServerErrorException('Une erreur interne est survenue lors de la création de l\'entreprise.');
      }
    }
  }

  async findAll() {
    try {
      const companies = await this.prismaService.company.findMany({
        where: {
          deleted: false,
        },
      });

      if (companies.length === 0) {
        return { message: 'Aucune compagnie trouvée.' };

      }
      return { message: 'Compagnie récupérées avec succès', companies };
        
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à voir la liste des entreprises.');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('L\'accès aux données des entreprises est interdit.');
      } else {
        throw new InternalServerErrorException('Une erreur interne est survenue lors de la récupération des entreprises.');
      }
    }
  }

  async findOne(id: number) {
    try {
      const company = await this.prismaService.company.findFirst({
        where: {
          id: id,
          deleted: false,
        },
      });

      if (!company) {
        throw new NotFoundException('L\'entreprise demandée est introuvable.');
      }

      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('L\'entreprise avec cet ID n\'existe pas.');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à voir cette entreprise.');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('L\'accès à cette entreprise est interdit.');
      } else {
        throw new InternalServerErrorException('Une erreur interne est survenue lors de la récupération de l\'entreprise.');
      }
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: {
          id: id,
          deleted: false,
        },
      });

      if (!company) {
        throw new NotFoundException('L\'entreprise à mettre à jour est introuvable.');
      }

      if (updateCompanyDto.name && updateCompanyDto.name.length < 3) {
        throw new BadRequestException('Le nom de l\'entreprise doit comporter au moins 3 caractères.');
      }

      return await this.prismaService.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('L\'entreprise à mettre à jour n\'existe pas.');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Les données fournies pour la mise à jour sont invalides.');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à mettre à jour cette entreprise.');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('L\'accès à la mise à jour de cette entreprise est interdit.');
      } else {
        throw new InternalServerErrorException('Une erreur interne est survenue lors de la mise à jour de l\'entreprise.');
      }
    }
  }

  async remove(id: number) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException('L\'entreprise à supprimer est introuvable.');
      }

      return await this.prismaService.company.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('L\'entreprise à supprimer n\'existe pas.');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à supprimer cette entreprise.');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('L\'accès à la suppression de cette entreprise est interdit.');
      } else {
        throw new InternalServerErrorException('Une erreur interne est survenue lors de la suppression de l\'entreprise.');
      }
    }
  }
}
