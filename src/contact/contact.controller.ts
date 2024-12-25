import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/updateContact.dto';
import { CreateContactDto } from './dto/createContact.dto';
import { FindContactByEmailDto } from './dto/findContactByEmail.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Contacts')  // Catégorie Swagger pour les contacts
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau contact' })  // Résumé pour Swagger
  @ApiBody({ description: 'Données pour créer un contact', type: CreateContactDto })  // Corps de la requête attendu
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Obtenir tous les contacts' })  // Décrit l'opération d'obtention de tous les contacts
  async findAll() {
    return this.contactService.findAll();
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un contact par son ID' })  // Décrit l'opération pour obtenir un contact spécifique
  @ApiParam({ name: 'id', description: 'ID du contact' })  // Paramètre ID
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':contactId/audiences')
  @ApiOperation({ summary: 'demander les audiences associées à un contact.' })  // Décrit l'opération pour obtenir un contact spécifique
  @ApiParam({ name: 'contactId', description: 'ID du contact' })  // Paramètre ID
  async getAudiencesByContact(@Param('contactId') contactId: string) {
    return this.contactService.getAudiencesByContact(+contactId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un contact existant' })  // Décrit l'opération de mise à jour
  @ApiParam({ name: 'id', description: 'ID du contact à mettre à jour' })  // Paramètre ID
  @ApiBody({ description: 'Données pour mettre à jour le contact', type: UpdateContactDto })  // Corps de la requête attendu
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }



  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un contact' })  // Décrit l'opération de suppression
  @ApiParam({ name: 'id', description: 'ID du contact à supprimer' })  // Paramètre ID
  async remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':contactId/audiences')
  @ApiOperation({ summary: 'Obtenir toutes les audiences associées à un contact' })  // Décrit l'opération pour obtenir les audiences associées
  @ApiParam({ name: 'contactId', description: 'ID du contact' })  // Paramètre contactId
  async findAudiencesByContact(@Param('contactId') contactId: string) {
    return this.contactService.findAudiencesByContact(+contactId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':contactId/messages')
  @ApiOperation({ summary: 'Obtenir tous les messages associés à un contact' })  // Décrit l'opération pour obtenir les messages associés
  @ApiParam({ name: 'contactId', description: 'ID du contact' })  // Paramètre contactId
  async findMessagesByContact(@Param('contactId') contactId: string) {
    return this.contactService.findMessagesByContact(+contactId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  @ApiOperation({ summary: 'Recherche de contact par email ou autres attributs' })  // Décrit l'opération de recherche de contact
  @ApiQuery({ name: 'email', description: 'Email du contact', required: false })  // Paramètre optionnel email
  @ApiQuery({ name: 'phone', description: 'Téléphone du contact', required: false })  // Paramètre optionnel phone
  @ApiQuery({ name: 'name', description: 'Nom du contact', required: false })  // Paramètre optionnel name
  async findContactByEmail(@Query() findContactByEmailDto: FindContactByEmailDto) {
    return this.contactService.findContactByEmail(findContactByEmailDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':contactId/audiences/:audienceId/messages')
  @ApiOperation({ summary: 'Obtenir tous les messages envoyés à un contact d\'une audience, avec possibilité de filtrer par campagne et/ou canal' })  // Décrit l'opération pour obtenir les messages filtrés
  @ApiParam({ name: 'contactId', description: 'ID du contact' })  // Paramètre contactId
  @ApiParam({ name: 'audienceId', description: 'ID de l\'audience' })  // Paramètre audienceId
  @ApiQuery({ name: 'campaignId', description: 'ID de la campagne (optionnel)', required: false })  // Paramètre optionnel campaignId
  @ApiQuery({ name: 'channelId', description: 'ID du canal (optionnel)', required: false })  // Paramètre optionnel channelId
  async getMessagesByContactAudienceCampaignChannel(
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
