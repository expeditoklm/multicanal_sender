import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Assurez-vous d'importer PrismaService correctement
import { CreateCompanyDto } from './dto/createCompanyDto ';
import { UpdateCompanyDto } from './dto/updateCompanyDto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return await this.prismaService.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    return await this.prismaService.company.findMany({
        where: {
            deleted: false,  // Filtrer les entreprises dont `deleted` est `false`
        },
    });
}


async findOne(id: number) {
    const company = await this.prismaService.company.findFirst({
        where: {
            id: id,
            deleted: false,  
        },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
}

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prismaService.company.findUnique({
        where: {
            id: id,
            deleted: false,  
        },
    });
    if (!company) throw new NotFoundException('Company not found');
    return await this.prismaService.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: number) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return await this.prismaService.company.update({
      where: { id },
      data: { deleted: true },  
    });
  }

}
