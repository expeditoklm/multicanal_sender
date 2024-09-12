import { IsInt } from 'class-validator';

export class RemoveContactFromAudienceDto {
  @IsInt()
  contactId: number;

  @IsInt()
  audienceId: number;
}
