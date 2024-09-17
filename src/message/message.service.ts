import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UpdateMessageDto } from './dto/updateMessage.dto';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMessageDto: CreateMessageDto) {
    const { object, content, status, channel_id, campaign_id, audience_id } = createMessageDto;

    // Vérifier l'existence du canal
    if (isNaN(channel_id) || channel_id <= 0) {
      throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
    }

    const channelExists = await this.prisma.channel.findUnique({ where: { id: channel_id, deleted: false } });
    if (!channelExists) {
      throw new NotFoundException(`Aucun canal trouvé avec l'ID ${channel_id}.`);
    }

    // Vérifier l'existence de la campagne
    if (isNaN(campaign_id) || campaign_id <= 0) {
      throw new BadRequestException('L\'ID de la campagne doit être un nombre valide supérieur à zéro.');
    }

    const campaignExists = await this.prisma.campaign.findUnique({ where: { id: campaign_id, deleted: false } });
    if (!campaignExists) {
      throw new NotFoundException(`Aucune campagne trouvée avec l'ID ${campaign_id}.`);
    }

    // Vérifier l'existence de l'audience
    if (isNaN(audience_id) || audience_id <= 0) {
      throw new BadRequestException('L\'ID de l\'audience doit être un nombre valide supérieur à zéro.');
    }

    const audienceExists = await this.prisma.audience.findUnique({ where: { id: audience_id, deleted: false } });
    if (!audienceExists) {
      throw new NotFoundException(`Aucune audience trouvée avec l'ID ${audience_id}.`);
    }

    // Si tous les IDs sont valides et existent, créer le message
    try {
      return await this.prisma.message.create({
        data: createMessageDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la création du message. Veuillez réessayer plus tard.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.message.findMany({
        where: { deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Nous n\'avons pas pu récupérer la liste des messages. Veuillez réessayer plus tard.');
    }
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('L\'ID du message est invalide. Veuillez fournir un ID numérique valide.');
    }

    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });

      if (!message) {
        throw new NotFoundException(`Le message avec l'ID ${id} n'existe pas.`);
      }

      if (message.deleted) {
        throw new NotFoundException(`Le message avec l'ID ${id} a été supprimé.`);
      }

      return message;
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération du message. Veuillez réessayer plus tard.');
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    if (isNaN(id)) {
      throw new BadRequestException('L\'ID du message est invalide. Veuillez fournir un ID numérique valide.');
    }

    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });

      if (!message) {
        throw new NotFoundException(`Le message avec l'ID ${id} n'existe pas.`);
      }

      if (message.deleted) {
        throw new NotFoundException(`Le message avec l'ID ${id} a été supprimé.`);
      }

      return await this.prisma.message.update({
        where: { id },
        data: updateMessageDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la mise à jour du message. Veuillez réessayer plus tard.');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('L\'ID du message est invalide. Veuillez fournir un ID numérique valide.');
    }

    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });

      if (!message) {
        throw new NotFoundException(`Le message avec l'ID ${id} n'existe pas.`);
      }

      if (message.deleted) {
        throw new NotFoundException(`Le message avec l'ID ${id} a déjà été supprimé.`);
      }

      return await this.prisma.message.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du message. Veuillez réessayer plus tard.');
    }
  }

  async sendMessage(messageId: number) {
    if (isNaN(messageId)) {
      throw new BadRequestException('L\'ID du message est invalide. Veuillez fournir un ID numérique valide.');
    }

    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new NotFoundException(`Le message avec l'ID ${messageId} n'existe pas.`);
      }

      if (message.deleted) {
        throw new NotFoundException(`Le message avec l'ID ${messageId} a déjà été supprimé.`);
      }

      // Logique pour envoyer le message via le canal
      // Note : Vous devrez probablement intégrer cette logique en fonction de votre implémentation de canal.
      // Par exemple, appeler un service de canal pour envoyer le message.

      return `Message avec l'ID ${messageId} envoyé avec succès.`;
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
    }
  }

  async getMessagesByStatus(status: MessageStatus) {
    try {
      return await this.prisma.message.findMany({
        where: { status, deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des messages par statut. Veuillez réessayer plus tard.');
    }
  }

  async findMessagesByCampaign(campaignId: number) {
    if (isNaN(campaignId)) {
      throw new BadRequestException('L\'ID de la campagne est invalide. Veuillez fournir un ID numérique valide.');
    }

    try {
      return await this.prisma.message.findMany({
        where: { campaign_id: campaignId, deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des messages par campagne. Veuillez réessayer plus tard.');
    }
  }

  async retryFailedMessages() {
    try {
      const failedMessages = await this.prisma.message.findMany({
        where: { status: MessageStatus.FAILED, deleted: false },
      });

      // Logique pour relancer les messages échoués
      // Note : Vous devrez probablement intégrer cette logique en fonction de votre implémentation
      // Par exemple, réessayer d'envoyer chaque message via un service de canal.

      return `Relance de ${failedMessages.length} messages échoués en cours.`;
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la relance des messages échoués. Veuillez réessayer plus tard.');
    }
  }
}
