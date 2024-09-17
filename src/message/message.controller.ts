import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UpdateMessageDto } from './dto/updateMessage.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { GetMessagesByStatusDto } from './dto/getMessagesByStatus.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Messages')  // Catégorie Swagger pour les messages
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau message' })  // Résumé pour Swagger
  @ApiBody({ description: 'Données pour créer un message', type: CreateMessageDto })  // Corps de la requête attendu
  @ApiResponse({ status: 201, description: 'Message créé avec succès.' })  // Réponse attendue
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les messages' })  // Décrit l'opération pour obtenir tous les messages
  @ApiResponse({ status: 200, description: 'Messages obtenus avec succès.' })  // Réponse attendue
  async findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un message par son ID' })  // Décrit l'opération pour obtenir un message spécifique
  @ApiParam({ name: 'id', description: 'ID du message' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Message trouvé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Message non trouvé.' })  // Réponse en cas d'erreur
  async findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id); // Convertir en nombre
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un message existant' })  // Décrit l'opération de mise à jour
  @ApiParam({ name: 'id', description: 'ID du message à mettre à jour' })  // Paramètre ID
  @ApiBody({ description: 'Données pour mettre à jour le message', type: UpdateMessageDto })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Message mis à jour.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Message non trouvé.' })  // Réponse en cas d'erreur
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto); // Convertir en nombre
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un message' })  // Décrit l'opération de suppression
  @ApiParam({ name: 'id', description: 'ID du message à supprimer' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Message supprimé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Message non trouvé.' })  // Réponse en cas d'erreur
  async remove(@Param('id') id: string) {
    return this.messageService.remove(+id); // Convertir en nombre
  }

  @Post('send')
  @ApiOperation({ summary: 'Envoyer un message' })  // Décrit l'opération d'envoi de message
  @ApiBody({ description: 'Données pour envoyer un message', type: SendMessageDto })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Message envoyé avec succès.' })  // Réponse attendue
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto.messageId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtenir les messages par statut' })  // Décrit l'opération pour obtenir les messages par statut
  @ApiQuery({ name: 'status', description: 'Statut des messages', type: String })  // Paramètre de requête pour le statut
  @ApiResponse({ status: 200, description: 'Messages obtenus avec succès.' })  // Réponse attendue
  async getMessagesByStatus(@Query() getMessagesByStatusDto: GetMessagesByStatusDto) {
    return this.messageService.getMessagesByStatus(getMessagesByStatusDto.status);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Obtenir les messages par campagne' })  // Décrit l'opération pour obtenir les messages par campagne
  @ApiParam({ name: 'campaignId', description: 'ID de la campagne' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Messages de la campagne trouvés.' })  // Réponse attendue
  async findMessagesByCampaign(@Param('campaignId') campaignId: string) {
    return this.messageService.findMessagesByCampaign(+campaignId); // Convertir en nombre
  }

  @Post('retry')
  @ApiOperation({ summary: 'Réessayer d\'envoyer les messages échoués' })  // Décrit l'opération pour réessayer d'envoyer les messages échoués
  @ApiResponse({ status: 200, description: 'Messages échoués réessayés avec succès.' })  // Réponse attendue
  async retryFailedMessages() {
    return this.messageService.retryFailedMessages();
  }
}
