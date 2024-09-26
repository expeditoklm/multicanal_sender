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
import { BullModule } from '@nestjs/bull';
import { TemplateMessageModule } from './template-message/template-message.module';
import Redis from 'ioredis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: 100, // Ajuste cette valeur si nécessaire
    });
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    MailerModule,
    AuthModule,
    PrismaModule,
    CompanyModule,
    UserCompanyModule,
    CampaignModule,
    ChannelModule,
    AudienceModule,
    ContactModule,
    MessageModule,
    InteractTypeModule,
    MessageContactModule,
    AudienceContactModule,
    TemplateTypeModule,
    TemplateModule,
    TemplateMessageModule,
  ],
  controllers: [],
  providers: [redisProvider], // Ajoute ici le provider Redis
})
export class AppModule {}
