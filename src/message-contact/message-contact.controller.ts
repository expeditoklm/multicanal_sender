import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { MessageContactService } from './message-contact.service';
import { CreateMessageContactDto } from './dto/createMessageContact.dto';
import { UpdateMessageContactDto } from './dto/updateMessageContact.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('MessageContacts')  // Catégorie Swagger pour les contacts de messages
@Controller('messageContacts')
export class MessageContactController {
  constructor(private readonly messageContactService: MessageContactService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau contact de message' })  // Résumé pour Swagger
  @ApiBody({ description: 'Données pour créer un contact de message', type: CreateMessageContactDto })  // Corps de la requête attendu
  @ApiResponse({ status: 201, description: 'Contact de message créé avec succès.' })  // Réponse attendue
  async create(@Body() createMessageContactDto: CreateMessageContactDto) {
    return this.messageContactService.create(createMessageContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les contacts de messages' })  // Décrit l'opération pour obtenir tous les contacts
  @ApiResponse({ status: 200, description: 'Contacts de messages obtenus avec succès.' })  // Réponse attendue
  async findAll() {
    return this.messageContactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un contact de message par son ID' })  // Décrit l'opération pour obtenir un contact spécifique
  @ApiParam({ name: 'id', description: 'ID du contact de message' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Contact de message trouvé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Contact de message non trouvé.' })  // Réponse en cas d'erreur
  async findOne(@Param('id') id: number) {
    return this.messageContactService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un contact de message existant' })  // Décrit l'opération de mise à jour
  @ApiParam({ name: 'id', description: 'ID du contact de message à mettre à jour' })  // Paramètre ID
  @ApiBody({ description: 'Données pour mettre à jour le contact de message', type: UpdateMessageContactDto })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Contact de message mis à jour.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Contact de message non trouvé.' })  // Réponse en cas d'erreur
  async update(@Param('id') id: number, @Body() updateMessageContactDto: UpdateMessageContactDto) {
    return this.messageContactService.update(+id, updateMessageContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un contact de message' })  // Décrit l'opération de suppression
  @ApiParam({ name: 'id', description: 'ID du contact de message à supprimer' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Contact de message supprimé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Contact de message non trouvé.' })  // Réponse en cas d'erreur
  async remove(@Param('id') id: number) {
    return this.messageContactService.remove(+id);
  }

  @Get('contact/:contactId/audiences')
  @ApiOperation({ summary: 'Obtenir les audiences associées à un contact' })  // Décrit l'opération pour obtenir les audiences d'un contact
  @ApiParam({ name: 'contactId', description: 'ID du contact' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Audiences obtenues avec succès.' })  // Réponse attendue
  async findAudiencesByContact(@Param('contactId') contactId: number) {
    return this.messageContactService.findAudiencesByContact(+contactId);
  }

  @Get('audience/:audienceId/contacts')
  @ApiOperation({ summary: 'Obtenir les contacts associés à une audience spécifique' })  // Décrit l'opération pour obtenir les contacts d'une audience
  @ApiParam({ name: 'audienceId', description: 'ID de l\'audience' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Contacts obtenus avec succès.' })  // Réponse attendue
  async findContactsByAudience(@Param('audienceId') audienceId: number) {
    return this.messageContactService.findContactsByAudience(+audienceId);
  }
}
