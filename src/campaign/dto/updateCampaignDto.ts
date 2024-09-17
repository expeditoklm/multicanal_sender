import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDto  } from './createCampaignDto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @IsBoolean({ message: 'La valeur du champ "deleted" doit être un booléen.' })
  @IsOptional()
  deleted?: boolean;
}