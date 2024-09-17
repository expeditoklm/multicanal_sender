import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class CreateMessageContactDto {
  @IsNotEmpty()
  @IsDate()
  interact_date: Date;

  @IsNotEmpty()
  @IsInt()
  message_id: number;

  @IsNotEmpty()
  @IsInt()
  contact_id: number;

  @IsNotEmpty()
  @IsInt()
  interact_type_id: number;
}
