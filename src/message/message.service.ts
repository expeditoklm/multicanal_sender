// src/services/message.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessageDto';
import { UpdateMessageDto } from './dto/updateMessageDto';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      where: { deleted: false },
    });
  }

  async findOne(id: number) {
    // Convertir l'ID en nombre si nécessaire
    const numericId = Number(id);
  
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }
  
    const message = await this.prisma.message.findUnique({
      where: { id: numericId },
    });
  
    if (!message || message.deleted) {
      throw new NotFoundException(`Message with ID ${numericId} not found or deleted`);
    }
  
    return message;
  }
  
  
  

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const numericId = Number(id);
  
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }
  
    const message = await this.prisma.message.findUnique({
      where: { id: numericId },
    });
  
    if (!message || message.deleted) {
      throw new NotFoundException(`Message with ID ${numericId} not found or deleted`);
    }
  
    return this.prisma.message.update({
      where: { id: numericId },
      data: updateMessageDto,
    });
  }
  
  
  async remove(id: number) {
    const numericId = Number(id);
  
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }
  
    const message = await this.prisma.message.findUnique({
      where: { id: numericId },
    });
  
    if (!message || message.deleted) {
      throw new NotFoundException(`Message with ID ${numericId} not found or already deleted`);
    }
  
    return this.prisma.message.update({
      where: { id: numericId },
      data: { deleted: true },
    });
  }

  async sendMessage(messageId: number) {

    if (typeof messageId !== 'number' || isNaN(messageId)) {
      throw new BadRequestException('Invalid ID');
    }
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message || message.deleted) {
      throw new NotFoundException(`Message with ID ${messageId} not found or already deleted`);
    }

    // Logique pour envoyer le message via le canal
    // Note : Vous devrez probablement intégrer cette logique en fonction de votre implémentation de canal.
    // Par exemple, appeler un service de canal pour envoyer le message.

    return `Message with ID ${messageId} sent`;
  }

  async getMessagesByStatus(status: MessageStatus) {
    return this.prisma.message.findMany({
      where: { status, deleted: false },
    });
  }

  async findMessagesByCampaign(campaignId: number) {
    return this.prisma.message.findMany({
      where: { campaign_id: campaignId, deleted: false },
    });
  }

  async retryFailedMessages() {
    const failedMessages = await this.prisma.message.findMany({
      where: { status: MessageStatus.FAILED, deleted: false },
    });

    // Logique pour relancer les messages échoués
    // Note : Vous devrez probablement intégrer cette logique en fonction de votre implémentation
    // Par exemple, réessayer d'envoyer chaque message via un service de canal.

    return `Retrying ${failedMessages.length} failed messages`;
  }
}
