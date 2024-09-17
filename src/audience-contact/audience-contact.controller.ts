import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AudienceContactService } from './audience-contact.service';
import { CreateAudienceContactDto } from './dto/createAudienceContact.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Contacts d’Audience') // Tag pour Swagger
@Controller('audienceContacts')
export class AudienceContactController {
  constructor(private readonly audienceContactService: AudienceContactService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau contact d’audience' }) // Décrit l'opération
  @ApiBody({ description: 'Les données nécessaires pour créer un contact d’audience', type: CreateAudienceContactDto }) // Décrit le corps de la requête
  async create(@Body() createAudienceContactDto: CreateAudienceContactDto) {
    return this.audienceContactService.create(createAudienceContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les contacts d’audience' }) // Décrit l'opération
  async findAll() {
    return this.audienceContactService.findAll();
  }

  @Get(':audienceId/:contactId')
  @ApiOperation({ summary: 'Trouver un contact d’audience par ID d’audience et ID de contact' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: Number }) // Paramètre audienceId
  @ApiParam({ name: 'contactId', description: 'L’ID du contact', type: Number }) // Paramètre contactId
  async findOne(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.findOne(+audienceId, +contactId);
  }

  @Delete(':audienceId/:contactId')
  @ApiOperation({ summary: 'Supprimer un contact d’audience par ID d’audience et ID de contact' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: Number }) // Paramètre audienceId
  @ApiParam({ name: 'contactId', description: 'L’ID du contact', type: Number }) // Paramètre contactId
  async remove(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.remove(+audienceId, +contactId);
  }
}
