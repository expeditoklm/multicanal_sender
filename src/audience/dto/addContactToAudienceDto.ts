import { IsInt } from 'class-validator';

export class AddContactToAudienceDto {
  @IsInt()
  contactId: number;

  @IsInt()
  audienceId: number;
}
