import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDto } from './createCampaign.dto';

export class UpdateCampaignDto extends PartialType(  CreateCampaignDto) { }