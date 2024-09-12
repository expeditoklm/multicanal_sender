import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtendCampaignDto {
    @Type(() => Date)
    @IsDate()
    newEndDate: Date; // La nouvelle date de fin pour la campagne
}
