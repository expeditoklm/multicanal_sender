import { IsDate, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageContactDto {
  @IsOptional()
  @IsDate()
  interact_date?: Date;

  @IsOptional()
  @IsInt()
  message_id?: number;

  @IsOptional()
  @IsInt()
  contact_id?: number;

  @IsOptional()
  @IsInt()
  interact_type_id?: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
