// contact.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/updateContactDto';
import { CreateContactDto } from './dto/createContactDto';
import { FindContactByEmailDto } from './dto/findContactByEmailDto';
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }

  // Obtenir toutes les audiences associées à un contact
  @Get(':contactId/audiences')
  findAudiencesByContact(@Param('contactId') contactId: string) {
    return this.contactService.findAudiencesByContact(+contactId);
  }

  // Obtenir tous les messages associés à un contact
  @Get(':contactId/messages')
  findMessagesByContact(@Param('contactId') contactId: string) {
    return this.contactService.findMessagesByContact(+contactId);
  }




  // Recherche de contact par email ou autres attributs
  @Get('search')
  findContactByEmail(@Query() findContactByEmailDto: FindContactByEmailDto) {
    return this.contactService.findContactByEmail(findContactByEmailDto);
  }


  // Route pour obtenir tous les messages envoyés à un contact d'une audience, 
  // avec la possibilité de filtrer par campagne et/ou canal
  @Get(':contactId/audiences/:audienceId/messages')
getMessagesByContactAudienceCampaignChannel(
  @Param('contactId') contactId: string,
  @Param('audienceId') audienceId: string,
  @Query('campaignId') campaignId?: string,  // Paramètre optionnel pour campagne
  @Query('channelId') channelId?: string     // Paramètre optionnel pour canal
) {
  return this.contactService.getMessagesByContactAudienceCampaignChannel(
    +contactId,  // Convertir en nombre
    +audienceId, // Convertir en nombre
    campaignId ? +campaignId : undefined,  // Convertir en nombre si présent
    channelId ? +channelId : undefined     // Convertir en nombre si présent
  );
}


}
