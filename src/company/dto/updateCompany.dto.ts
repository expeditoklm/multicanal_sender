import { CreateCompanyDto } from './createCompany.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(  CreateCompanyDto) { }