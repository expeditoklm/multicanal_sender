// src/services/user-company.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assure-toi d'avoir un service Prisma configuré
import { FindUsersByCompanyDto } from './dto/findUsersByCompanyDto';
import { RemoveUserFromCompanyDto } from './dto/removeUserFromCompanyDto';
import { GetCompanyByUserDto } from './dto/getCompanyByUserDto';
import { UpdateUserCompanyDto } from './dto/updateUserCompanyDto';
import { AssociateUserToCompaniesDto } from './dto/associateUserToCompaniesDto';


@Injectable()
export class UserCompanyService {
    constructor(private prisma: PrismaService) { }

    async findUsersByCompany(dto: FindUsersByCompanyDto) {
        return this.prisma.userCompany.findMany({
            where: { company_id: dto.companyId, deleted: false },
            include: { user: true },
        });
    }


    async removeUserFromCompany(dto: RemoveUserFromCompanyDto) {
        return this.prisma.userCompany.updateMany({
            where: { user_id: dto.userId, company_id: dto.companyId, deleted: false },
            data: { deleted: true },
        });
    }

    async getCompanyByUser(dto: GetCompanyByUserDto) {
        return this.prisma.userCompany.findMany({
            where: { user_id: dto.userId, deleted: false },
            include: { company: true },
        });
    }





    async associateUserToCompanies(dto: AssociateUserToCompaniesDto) {
        // Supprime les anciennes associations si nécessaire
        await this.prisma.userCompany.deleteMany({
            where: { user_id: dto.userId, deleted: false },
        });

        // Associe l'utilisateur aux nouvelles entreprises
        const associations = dto.companyIds.map(companyId => ({
            user_id: dto.userId,
            company_id: companyId,
            deleted: false,
        }));

        return this.prisma.userCompany.createMany({
            data: associations,
        });
    }

    async updateUserCompany(dto: UpdateUserCompanyDto) {
        // Si oldCompanyId est fourni, on met à jour cette ancienne entreprise
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

        // Ajoute la nouvelle entreprise si elle n'est pas déjà associée
        return this.prisma.userCompany.upsert({
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
    }








}

