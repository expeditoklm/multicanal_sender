// dto/update-contact.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContactDto';

export class UpdateContactDto extends PartialType(CreateContactDto) {}
