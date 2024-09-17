import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AudienceService } from './audience.service';
import { CreateAudienceDto } from './dto/createAudience.dto';
import { UpdateAudienceDto } from './dto/updateAudience.dto';
import { AddContactToAudienceDto } from './dto/addContactToAudience.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Audience') // Groupe de routes pour Swagger
@Controller('audiences')
export class AudienceController {
  constructor(private readonly audienceService: AudienceService) { }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle audience' }) // Décrit l'opération
  @ApiBody({ description: 'Données pour créer une audience', type: CreateAudienceDto }) // Décrit le corps de la requête
  create(@Body() createAudienceDto: CreateAudienceDto) {
    return this.audienceService.create(createAudienceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les audiences' }) // Décrit l'opération
  findAll() {
    return this.audienceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findOne(@Param('id') id: string) {
    return this.audienceService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience à mettre à jour', type: String }) // Paramètre id
  @ApiBody({ description: 'Données pour mettre à jour l’audience', type: UpdateAudienceDto }) // Décrit le corps de la requête
  update(@Param('id') id: string, @Body() updateAudienceDto: UpdateAudienceDto) {
    return this.audienceService.update(+id, updateAudienceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience à supprimer', type: String }) // Paramètre id
  remove(@Param('id') id: string) {
    return this.audienceService.remove(parseInt(id));
  }

  @Get(':audienceId/messages')
  @ApiOperation({ summary: 'Obtenir tous les messages d’une audience spécifique' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findMessagesByAudience(@Param('audienceId') audienceId: string) {
    return this.audienceService.findMessagesByAudience(+audienceId);
  }

  @Get(':audienceId/contacts')
  @ApiOperation({ summary: 'Obtenir tous les contacts d’une audience spécifique' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findContactsByAudience(@Param('audienceId') audienceId: string) {
    return this.audienceService.findContactsByAudience(+audienceId);
  }

  @Post('add-contact')
  @ApiOperation({ summary: 'Ajouter un contact à une audience' }) // Décrit l'opération
  @ApiBody({ description: 'Données pour ajouter un contact à l’audience', type: AddContactToAudienceDto }) // Décrit le corps de la requête
  addContactToAudience(@Body() dto: AddContactToAudienceDto) {
    return this.audienceService.addContactToAudience(dto.contactId, dto.audienceId);
  }

  @Post(':id/contacts')
  @ApiOperation({ summary: 'Associer un tableau de contacts à une audience' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience', type: String }) // Paramètre id
  @ApiBody({ description: 'Tableau de contacts à associer', type: [Object] }) // Décrit le corps de la requête
  async associateContacts(
    @Param('id') audienceId: string,
    @Body() contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[]
  ) {
    return this.audienceService.associateContacts(parseInt(audienceId), contacts);
  }
}
