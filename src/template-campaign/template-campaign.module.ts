import { Module } from '@nestjs/common';
import { TemplateCampaignController } from './template-campaign.controller';
import { TemplateCampaignService } from './template-campaign.service';

@Module({
  controllers: [TemplateCampaignController],
  providers: [TemplateCampaignService]
})
export class TemplateCampaignModule {}
