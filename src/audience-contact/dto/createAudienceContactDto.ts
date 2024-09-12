import { IsInt } from "class-validator";

export class CreateAudienceContactDto {
  
    @IsInt()
    audience_id: number;

    @IsInt()
    contact_id: number;
  }
  