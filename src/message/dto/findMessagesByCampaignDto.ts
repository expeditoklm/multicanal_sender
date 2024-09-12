import { IsInt, IsNotEmpty } from "class-validator";

export class FindMessagesByCampaignDto {
    @IsInt()
    @IsNotEmpty()
    campaignId: number;
  }