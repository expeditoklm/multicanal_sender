// create-channel.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
