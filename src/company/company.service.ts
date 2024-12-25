import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
  Body,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { table } from 'console';
import { AssociateUserToCompaniesDto } from 'src/user-company/dto/associateUserToCompanies.dto';
import { UserCompanyService } from 'src/user-company/user-company.service';
import { ActivateCompanyDto } from './dto/activateCompany.dto';
import { AssociateUserToCompanyDto } from 'src/user-company/dto/AssociateUserToCompanyDto.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {

      if (!createCompanyDto.name) {
        throw new BadRequestException('Le nom est requis.');
      }
      // Vérification de l'existence de l'entreprise
      const existingCompany = await this.prismaService.company.findFirst({
        where: { name: createCompanyDto.name },
      });

      if (existingCompany) {
        throw new ConflictException('Une entreprise avec ce nom existe déjà.');
      }
      try {
      console.log( "donner de creation : ",createCompanyDto)

      // Création de la nouvelle entreprise
      const newCompany = await this.prismaService.company.create({
        data: createCompanyDto,
      });

      // Association de l'utilisateur à l'entreprise nouvellement créée
      const associateUserToCompanyDto: AssociateUserToCompanyDto = {
        companyId: newCompany.id
      };

      await this.userCompanyService.create(
        associateUserToCompanyDto,  userId
      );

      return newCompany;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Les données fournies sont incorrectes.');
      } else if (error instanceof ConflictException) {
        throw new ConflictException(
          "Conflit détecté lors de la création de l'entreprise.",
        );
      } else {
        throw new InternalServerErrorException(
          "Une erreur interne est survenue lors de la création de l'entreprise.",
        );
      }
    }
  }

  async findAll() {
    try {
      const companies = await this.prismaService.company.findMany({
        where: {
          deleted: false,
          userCompanies: {
            some: {
              isMember: true,
              deleted: false,
            },
          },
        },
        include: {
          userCompanies: {
            where: {
              isMember: true,
              deleted: false,
            },
            include: {
              user: true, // Inclure les informations des utilisateurs liés.
            },
          },
        },
      });

      if (companies.length === 0) {
        return { message: 'Aucune compagnie trouvée.' };
      }

      return {
        message: 'Compagnies récupérées avec succès.',
        companies,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          "Vous n'êtes pas autorisé à voir la liste des entreprises.",
        );
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          "L'accès aux données des entreprises est interdit.",
        );
      } else {
        throw new InternalServerErrorException(
          'Une erreur interne est survenue lors de la récupération des entreprises.',
        );
      }
    }
  }
  async findOne(id: number) {
    const company = await this.prismaService.company.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
  
    if (!company) {
      throw new NotFoundException(`L'entreprise avec l'ID ${id} est introuvable.`);
    }
  
    return company;
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
        throw new NotFoundException(
          "L'entreprise à mettre à jour est introuvable.",
        );
      }

      if (updateCompanyDto.name && updateCompanyDto.name.length < 3) {
        throw new BadRequestException(
          "Le nom de l'entreprise doit comporter au moins 3 caractères.",
        );
      }

      return await this.prismaService.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          "L'entreprise à mettre à jour n'existe pas.",
        );
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Les données fournies pour la mise à jour sont invalides.',
        );
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          "Vous n'êtes pas autorisé à mettre à jour cette entreprise.",
        );
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          "L'accès à la mise à jour de cette entreprise est interdit.",
        );
      } else {
        throw new InternalServerErrorException(
          "Une erreur interne est survenue lors de la mise à jour de l'entreprise.",
        );
      }
    }
  }

  async remove(id: number) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException(
          "L'entreprise à supprimer est introuvable.",
        );
      }

      return await this.prismaService.company.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("L'entreprise à supprimer n'existe pas.");
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          "Vous n'êtes pas autorisé à supprimer cette entreprise.",
        );
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          "L'accès à la suppression de cette entreprise est interdit.",
        );
      } else {
        throw new InternalServerErrorException(
          "Une erreur interne est survenue lors de la suppression de l'entreprise.",
        );
      }
    }
  }

  async activateCompany(@Body() activateCompanyDto: ActivateCompanyDto) {
    const company = await this.prismaService.company.findFirst({
      where: { id: activateCompanyDto.company_id },
    });
    if (!company) throw new ConflictException('Company does not exist');

    const companyActivated = await this.prismaService.company.update({
      where: { id: company.id },
      data: { isActive: true },
    });

    return {
      company: companyActivated,
      data: 'User activated  successfully',
    };
  }

  
}
