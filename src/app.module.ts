import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { CompanyModule } from './company/company.module';
import { UserCompanyModule } from './user-company/user-company.module';
import { CampaignModule } from './campaign/campaign.module';
import { ChannelModule } from './channel/channel.module';
import { AudienceModule } from './audience/audience.module';
import { ContactModule } from './contact/contact.module';
import { MessageModule } from './message/message.module';
import { InteractTypeModule } from './interact-type/interact-type.module';
import { MessageContactModule } from './message-contact/message-contact.module';
import { AudienceContactModule } from './audience-contact/audience-contact.module';
import { TemplateTypeModule } from './template-type/template-type.module';
import { TemplateModule } from './template/template.module';
import { TemplateCampaignModule } from './template-campaign/template-campaign.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),AuthModule, PrismaModule, MailerModule, CompanyModule, UserCompanyModule, CampaignModule, ChannelModule, AudienceModule, ContactModule, MessageModule, InteractTypeModule, MessageContactModule, AudienceContactModule, TemplateTypeModule, TemplateModule, TemplateCampaignModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
 