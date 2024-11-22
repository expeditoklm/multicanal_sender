import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserCompanyDto } from './dto/createUserCompany.dto';
import { UpdateUserCompanyDto } from './dto/updateUserCompany.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'Un utilisateur avec cet email existe déjà.',
        );
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      return this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Propager les exceptions spécifiques si nécessaire
      }
      // Gérer d'autres types d'erreurs ici si nécessaire
      throw new InternalServerErrorException('Erreur interne du serveur.');
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deleted: false },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        userCompanies: true,
      },
    });
  }

  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(
        "L'ID doit être un nombre valide supérieur à zéro.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        userCompanies: true,
      },
    });

    if (!user || user.deleted) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${id}.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(
        "L'ID doit être un nombre valide supérieur à zéro.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deleted) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${id}.`);
    }

    // Si le mot de passe est mis à jour, le hasher
    

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(
        "L'ID doit être un nombre valide supérieur à zéro.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deleted) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'ID ${id}.`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async createUserCompany(createUserCompanyDto: CreateUserCompanyDto) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: createUserCompanyDto.user_id },
    });

    if (!user || user.deleted) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createUserCompanyDto.user_id} non trouvé.`,
      );
    }

    // Vérifier si l'association existe déjà
    const existingAssociation = await this.prisma.userCompany.findFirst({
      where: {
        user_id: createUserCompanyDto.user_id,
        company_id: createUserCompanyDto.company_id,
        deleted: false,
      },
    });

    if (existingAssociation) {
      throw new ConflictException(
        'Cette association utilisateur-entreprise existe déjà.',
      );
    }

    return this.prisma.userCompany.create({
      data: createUserCompanyDto,
    });
  }

  async updateUserCompany(
    userId: number,
    companyId: number,
    updateUserCompanyDto: UpdateUserCompanyDto,
  ) {
    const association = await this.prisma.userCompany.findFirst({
      where: {
        user_id: userId,
        company_id: companyId,
        deleted: false,
      },
    });

    if (!association) {
      throw new NotFoundException(
        'Association utilisateur-entreprise non trouvée.',
      );
    }

    return this.prisma.userCompany.update({
      where: {
        id: association.id,
      },
      data: updateUserCompanyDto,
    });
  }
}
