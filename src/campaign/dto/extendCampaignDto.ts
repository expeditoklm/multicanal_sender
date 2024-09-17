import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtendCampaignDto {
    @Type(() => Date)
    @IsDate({ message: 'La nouvelle date de fin doit être une date valide.' })
    newEndDate: Date;
}
