import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/createMessageDto';
import { UpdateMessageDto } from './dto/updateMessageDto';
import { SendMessageDto } from './dto/sendMessageDto';
import { GetMessagesByStatusDto } from './dto/getMessagesByStatusDto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  async findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id); // Convertir en nombre
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto); // Convertir en nombre
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.messageService.remove(+id); // Convertir en nombre
  }

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto.messageId);
  }

  // Correction pour utiliser les paramètres de requête au lieu du corps dans GET
  @Get('status')
  async getMessagesByStatus(@Query() getMessagesByStatusDto: GetMessagesByStatusDto) {
    return this.messageService.getMessagesByStatus(getMessagesByStatusDto.status);
  }

  @Get('campaign/:campaignId')
  async findMessagesByCampaign(@Param('campaignId') campaignId: string) {
    return this.messageService.findMessagesByCampaign(+campaignId); // Convertir en nombre
  }

  @Post('retry')
  async retryFailedMessages() {
    return this.messageService.retryFailedMessages();
  }
}
