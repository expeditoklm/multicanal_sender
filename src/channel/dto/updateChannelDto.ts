// update-channel.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
