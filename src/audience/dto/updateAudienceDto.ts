// dto/update-audience.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAudienceDto } from './createAudienceDto';

export class UpdateAudienceDto extends PartialType(CreateAudienceDto) {}
