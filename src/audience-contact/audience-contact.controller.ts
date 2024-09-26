import { Controller, Post, Get, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AudienceContactService } from './audience-contact.service';
import { CreateAudienceContactDto } from './dto/createAudienceContact.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Contacts d’Audience') // Tag pour Swagger
@Controller('audienceContacts')
export class AudienceContactController {
  constructor(private readonly audienceContactService: AudienceContactService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau contact d’audience' }) // Décrit l'opération
  @ApiBody({ description: 'Les données nécessaires pour créer un contact d’audience', type: CreateAudienceContactDto }) // Décrit le corps de la requête
  async create(@Body() createAudienceContactDto: CreateAudienceContactDto,@Req() request : Request) {
    const userId =  request.user['id'];
    return this.audienceContactService.create(createAudienceContactDto,userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les contacts d’audience' }) // Décrit l'opération
  async findAll() {
    return this.audienceContactService.findAll();
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':audienceId/:contactId')
  @ApiOperation({ summary: 'Trouver un contact d’audience par ID d’audience et ID de contact' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: Number }) // Paramètre audienceId
  @ApiParam({ name: 'contactId', description: 'L’ID du contact', type: Number }) // Paramètre contactId
  async findOne(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.findOne(+audienceId, +contactId);
  }



  @UseGuards(AuthGuard('jwt'))
  @Delete(':audienceId/:contactId')
  @ApiOperation({ summary: 'Supprimer un contact d’audience par ID d’audience et ID de contact' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: Number }) // Paramètre audienceId
  @ApiParam({ name: 'contactId', description: 'L’ID du contact', type: Number }) // Paramètre contactId
  async remove(@Param('audienceId') audienceId: number, @Param('contactId') contactId: number) {
    return this.audienceContactService.remove(+audienceId, +contactId);
  }
}
