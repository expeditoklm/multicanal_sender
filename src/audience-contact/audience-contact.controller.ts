import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AudienceContactService } from './audience-contact.service';
import { CreateAudienceContactDto } from './dto/createAudienceContactDto';

@Controller('audienceContacts')
export class AudienceContactController {
  constructor(private readonly audienceContactService: AudienceContactService) {}

  @Post()
  async create(@Body() createAudienceContactDto: CreateAudienceContactDto) {
    return this.audienceContactService.create(createAudienceContactDto);
  }

  @Get()
  async findAll() {
    return this.audienceContactService.findAll();
  }

  @Get(':audienceId/:contactId')
  async findOne(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.findOne(+audienceId, +contactId);
  }

  @Delete(':audienceId/:contactId')
  async remove(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.remove(+audienceId, +contactId);
  }
}
