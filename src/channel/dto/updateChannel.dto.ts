// update-channel.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString({ message: 'Le label du canal doit être une chaîne de caractères.' })
  label?: string;

  @IsOptional()
  @IsBoolean({ message: 'Le champ "deleted" doit être un booléen.' })
  deleted?: boolean;
}
