// audience.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AudienceService } from './audience.service';

import { CreateAudienceDto } from './dto/createAudienceDto';
import { UpdateAudienceDto } from './dto/updateAudienceDto';
import { AddContactToAudienceDto } from './dto/addContactToAudienceDto';
import { RemoveContactFromAudienceDto } from './dto/removeContactFromAudienceDto';
@Controller('audiences')
export class AudienceController {
    constructor(private readonly audienceService: AudienceService) { }

    @Post()
    create(@Body() createAudienceDto: CreateAudienceDto) {
        return this.audienceService.create(createAudienceDto);
    }

    @Get()
    findAll() {
        return this.audienceService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.audienceService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateAudienceDto: UpdateAudienceDto) {
        return this.audienceService.update(+id, updateAudienceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.audienceService.remove(parseInt(id));
    }
    
    // Obtenir tous les messages d'une audience spécifique
    @Get(':audienceId/messages')
    findMessagesByAudience(@Param('audienceId') audienceId: string) {
        return this.audienceService.findMessagesByAudience(+audienceId);
    }

    // Obtenir tous les contacts d'une audience spécifique
    @Get(':audienceId/contacts')
    findContactsByAudience(@Param('audienceId') audienceId: string) {
        return this.audienceService.findContactsByAudience(+audienceId);
    }




  // Route pour ajouter un contact à une audience
  @Post('add-contact')
  addContactToAudience(@Body() dto: AddContactToAudienceDto) {
    return this.audienceService.addContactToAudience(dto.contactId, dto.audienceId);
  }

  // Route pour ajouter un tableau de contact à une audience sous format json

  @Post(':id/contacts')
  async associateContacts(
    @Param('id') audienceId: string,
    @Body() contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[]
  ) {
    return this.audienceService.associateContacts(parseInt(audienceId), contacts);
  }


}
