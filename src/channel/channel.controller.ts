import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Canaux')  // Catégorie Swagger pour les canaux
@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) { }

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau canal' })  // Résumé pour Swagger
    @ApiBody({ description: 'Données pour créer un canal', type: CreateChannelDto })  // Corps de la requête attendu
    create(@Body() createChannelDto: CreateChannelDto) {
        return this.channelService.create(createChannelDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir tous les canaux' })  // Décrit l'opération d'obtention de tous les canaux
    findAll() {
        return this.channelService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un canal par son ID' })  // Décrit l'opération pour obtenir un canal spécifique
    @ApiParam({ name: 'id', description: 'ID du canal' })  // Paramètre ID
    findOne(@Param('id') id: string) {
        return this.channelService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un canal existant' })  // Décrit l'opération de mise à jour
    @ApiParam({ name: 'id', description: 'ID du canal à mettre à jour' })  // Paramètre ID
    @ApiBody({ description: 'Données pour mettre à jour le canal', type: UpdateChannelDto })  // Corps de la requête attendu
    update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
        return this.channelService.update(+id, updateChannelDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Supprimer un canal' })  // Décrit l'opération de suppression d'un canal
    @ApiParam({ name: 'id', description: 'ID du canal à supprimer' })  // Paramètre ID
    remove(@Param('id') id: string) {
        return this.channelService.remove(+id);
    }

    @Get(':channelId/messages')
    @ApiOperation({ summary: 'Obtenir tous les messages d’un canal spécifique' })  // Décrit l'opération pour obtenir les messages d'un canal
    @ApiParam({ name: 'channelId', description: 'ID du canal' })  // Paramètre ID du canal
    findMessagesByChannel(@Param('channelId') channelId: string) {
        return this.channelService.findMessagesByChannel(+channelId);
    }
}
