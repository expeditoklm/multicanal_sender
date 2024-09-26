import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Assurez-vous d'importer PrismaService correctement
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserCompanyModule } from 'src/user-company/user-company.module';
@Module({
  imports : [UserCompanyModule],
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
