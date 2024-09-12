import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { CompanyModule } from './company/company.module';
import { UserCompanyModule } from './user-company/user-company.module';
import { CampaignModule } from './campaign/campaign.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),AuthModule, PrismaModule, MailerModule, CompanyModule, UserCompanyModule, CampaignModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
 