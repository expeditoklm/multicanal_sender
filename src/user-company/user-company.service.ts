import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindUsersByCompanyDto } from './dto/findUsersByCompany.dto';
import { RemoveUserFromCompanyDto } from './dto/removeUserFromCompany.dto';
import { GetCompanyByUserDto } from './dto/getCompanyByUser.dto';
import { UpdateUserCompanyDto } from './dto/updateUserCompany.dto';
import { AssociateUserToCompaniesDto } from './dto/associateUserToCompanies.dto';

@Injectable()
export class UserCompanyService {
  constructor(private prisma: PrismaService) { }

  async findUsersByCompany(dto: FindUsersByCompanyDto) {
    // Vérifier la validité de companyId
    if (isNaN(dto.companyId) || dto.companyId <= 0) {
      throw new BadRequestException('L\'ID de l\'entreprise doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de l'entreprise
    const companyExists = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
    if (!companyExists) {
      throw new NotFoundException(`Aucune entreprise trouvée avec l'ID ${dto.companyId}.`);
    }

    // Récupérer les utilisateurs associés
    try {
      return await this.prisma.userCompany.findMany({
        where: { company_id: dto.companyId, deleted: false },
        include: { user: true },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des utilisateurs associés. Veuillez réessayer plus tard.');
    }
  }

  async removeUserFromCompany(dto: RemoveUserFromCompanyDto) {
    // Vérifier la validité des IDs
    if (isNaN(dto.userId) || dto.userId <= 0) {
      throw new BadRequestException('L\'ID de l\'utilisateur doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(dto.companyId) || dto.companyId <= 0) {
      throw new BadRequestException('L\'ID de l\'entreprise doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de l'utilisateur et de l'entreprise
    const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    const companyExists = await this.prisma.company.findUnique({ where: { id: dto.companyId } });

    if (!userExists) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${dto.userId}.`);
    }
    if (!companyExists) {
      throw new NotFoundException(`Aucune entreprise trouvée avec l'ID ${dto.companyId}.`);
    }

    // Vérifier l'existence de la relation avant de supprimer
    const relationExists = await this.prisma.userCompany.findUnique({
      where: { user_id_company_id: { user_id: dto.userId, company_id: dto.companyId } },
    });

    if (!relationExists) {
      throw new NotFoundException(`Aucune association trouvée pour l'utilisateur avec l'ID ${dto.userId} et l'entreprise avec l'ID ${dto.companyId}.`);
    }

    // Supprimer la relation
    try {
      return await this.prisma.userCompany.updateMany({
        where: { user_id: dto.userId, company_id: dto.companyId, deleted: false },
        data: { deleted: true },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression de l\'utilisateur de l\'entreprise. Veuillez réessayer plus tard.');
    }
  }

  async getCompanyByUser(dto: GetCompanyByUserDto) {
    // Vérifier la validité de userId
    if (isNaN(dto.userId) || dto.userId <= 0) {
      throw new BadRequestException('L\'ID de l\'utilisateur doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de l'utilisateur
    const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userExists) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${dto.userId}.`);
    }

    // Récupérer les entreprises associées
    try {
      return await this.prisma.userCompany.findMany({
        where: { user_id: dto.userId, deleted: false },
        include: { company: true },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des entreprises associées à l\'utilisateur. Veuillez réessayer plus tard.');
    }
  }

  async associateUserToCompanies(dto: AssociateUserToCompaniesDto) {
    // Vérifier la validité de userId
    if (isNaN(dto.userId) || dto.userId <= 0) {
      throw new BadRequestException('L\'ID de l\'utilisateur doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de l'utilisateur
    const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userExists) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${dto.userId}.`);
    }

    // Vérifier la validité des companyIds
    // if (!Array.isArray(dto.companyIds) || dto.companyIds.length === 0) {
    //   throw new BadRequestException('La liste des IDs des entreprises ne peut pas être vide.');
    // }
    for (const companyId of dto.companyIds) {
      if (isNaN(companyId) || companyId <= 0) {
        throw new BadRequestException(`L'ID de l'entreprise ${companyId} doit être un nombre valide supérieur à zéro.`);
      }
      const companyExists = await this.prisma.company.findUnique({ where: { id: companyId } });
      if (!companyExists) {
        throw new NotFoundException(`Aucune entreprise trouvée avec l'ID ${companyId}.`);
      }
    }

    // Supprimer les anciennes associations
    await this.prisma.userCompany.deleteMany({
      where: { user_id: dto.userId, deleted: false },
    });

    // Associer l'utilisateur aux nouvelles entreprises
    try {
      const associations = dto.companyIds.map(companyId => ({
        user_id: dto.userId,
        company_id: companyId,
        deleted: false,
        isMember: true,
      }));

      return await this.prisma.userCompany.createMany({
        data: associations,
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de l\'association de l\'utilisateur aux entreprises. Veuillez réessayer plus tard.');
    }
  }

  async updateUserCompany(dto: UpdateUserCompanyDto) {
    // Vérifier la validité des IDs
    if (isNaN(dto.userId) || dto.userId <= 0) {
      throw new BadRequestException('L\'ID de l\'utilisateur doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(dto.newCompanyId) || dto.newCompanyId <= 0) {
      throw new BadRequestException('L\'ID de la nouvelle entreprise doit être un nombre valide supérieur à zéro.');
    }
    if (dto.oldCompanyId && (isNaN(dto.oldCompanyId) || dto.oldCompanyId <= 0)) {
      throw new BadRequestException('L\'ID de l\'ancienne entreprise doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de l'utilisateur
    const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userExists) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${dto.userId}.`);
    }

    // Vérifier l'existence de la nouvelle entreprise
    const newCompanyExists = await this.prisma.company.findUnique({ where: { id: dto.newCompanyId } });
    if (!newCompanyExists) {
      throw new NotFoundException(`Aucune nouvelle entreprise trouvée avec l'ID ${dto.newCompanyId}.`);
    }

    // Vérifier l'existence de l'ancienne entreprise si fournie
    if (dto.oldCompanyId) {
      const oldCompanyExists = await this.prisma.company.findUnique({ where: { id: dto.oldCompanyId } });
      if (!oldCompanyExists) {
        throw new NotFoundException(`Aucune ancienne entreprise trouvée avec l'ID ${dto.oldCompanyId}.`);
      }
    }

    // Mettre à jour les associations
    try {
      if (dto.oldCompanyId) {
        await this.prisma.userCompany.updateMany({
          where: {
            user_id: dto.userId,
            company_id: dto.oldCompanyId,
            deleted: false,
          },
          data: { deleted: true },
        });
      }

      return await this.prisma.userCompany.upsert({
        where: {
          user_id_company_id: {
            user_id: dto.userId,
            company_id: dto.newCompanyId,
          },
        },
        update: {},
        create: {
          user_id: dto.userId,
          company_id: dto.newCompanyId,
          deleted: false,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour de l\'association utilisateur-entreprise. Veuillez réessayer plus tard.');
    }
  }
}
