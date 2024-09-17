// dto/update-audience.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAudienceDto } from './createAudience.dto';

export class UpdateAudienceDto extends PartialType(CreateAudienceDto) { }
