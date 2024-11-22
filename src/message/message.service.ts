import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UpdateMessageDto } from './dto/updateMessage.dto';
import { MessageStatus } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';

import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleMessageDto } from './dto/scheduleMessage.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService,
    private readonly emailService: MailerService
  ) { }

  async create(createMessageDto: CreateMessageDto, userId:number) {
    const { object, content, status, campaign_id, audience_id } = createMessageDto;

 

   
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

    if (audienceExists.company_id != campaignExists.company_id) {
      throw new NotFoundException(`Cette campagne ne peut pas être utilisée avec cette audience, car les compagnies ne sont pas identiques.`);
    }
    
// Vérification de l'existence de l'utilisateur dans la compagnie
    const userIsInCompany = await this.prisma.userCompany.findFirst({
      where: {
        company_id: audienceExists.company_id,
        user_id: userId,
      },
    });

    if (!userIsInCompany) {
      throw new BadRequestException('Vous ne pouvez pas créer un message pour cette compagnie.');
    }

    // Si tous les IDs sont valides et existent, créer le message
    try {
      const messageCreate = await this.prisma.message.create({
        data: createMessageDto,
      });
      return { message: 'Message créée avec succès', messageCreate };
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
  // Main function to send a message to all contacts
  async sendMessage(messageId: number): Promise<string> {

    if (isNaN(messageId)) {
      console.error(`ID du message non valide: ${messageId}`);
      throw new BadRequestException("L'ID du message est invalide. Veuillez fournir un ID numérique valide.");
    }

    // Récupérer le message
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new BadRequestException (`Le message avec l'ID ${messageId} n'existe pas.`);
    }

    if (message.deleted) {
      throw new BadRequestException ( `Le message avec l'ID ${messageId} a déjà été supprimé.`);
    }

    // Récupérer les contacts liés à l'audience du message
    const contacts = await this.prisma.audienceContact.findMany({
      where: {
        audience_id: message.audience_id,
      },
    });

    if (!contacts.length) {
      throw new NotFoundException("Aucun contact trouvé pour l'audience spécifiée.");
    }

    try {
      const templateMessage = await this.prisma.templateMessage.findFirst({
        where: { message_id: messageId }
      });

      const template = await this.prisma.template.findFirst({
        where: { id: templateMessage.template_id }
      });

      const templateType = await this.prisma.templateType.findFirst({
        where: { id: template.template_type_id }
      });

      const channel = await this.prisma.channel.findFirst({
        where: { id: templateType.channel_id }
      });

    
      

      // Tableau pour suivre les contacts échoués
      const failedContacts = [];

      // Envoi d'e-mails aux contacts
      const sendMailPromises = contacts.map(async (contact) => {
        const _1contact = await this.prisma.contact.findFirst({
          where: {
            id: contact.contact_id,
          },
        });


       

        try {
          if(channel.label === "Email") {
            await this.emailService.sendMail(_1contact, message);
          }
        } catch (error) {
          failedContacts.push(contact); // Ajouter aux contacts échoués
        }
      });

      await Promise.all(sendMailPromises);
      return `Message avec l'ID ${messageId} envoyé avec succès. Contacts échoués : ${failedContacts.length}.`;

    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
      );
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

  async retryFailedMessages(): Promise<string> {
    try {
      // Récupérer tous les enregistrements de messageContact où hasRecevedMsg est faux
      const failedMessageContacts = await this.prisma.messageContact.findMany({
        where: { hasRecevedMsg: false },
        include: {
          message: true, // Inclut le message associé
          contact: true, // Inclut les détails du contact
        },
      });
  
      if (!failedMessageContacts.length) {
        return 'Aucun contact échoué à renvoyer.';
      }
  
      // Réinitialiser la liste des contacts échoués après cette tentative
      const retryFailedContacts = [];
  
      // Tentative de réenvoyer les messages
      const retryPromises = failedMessageContacts.map(async (messageContact) => {
        try {
          await this.emailService.sendMail(messageContact.contact, messageContact.message);
  
          // Mettre à jour l'enregistrement après la réussite de l'envoi
          await this.prisma.messageContact.update({
            where: { id: messageContact.id },
            data: {
              hasRecevedMsg: true,
              updated_at: new Date(),
            },
          });
  
          console.log(`Message renvoyé avec succès au contact: ${messageContact.contact.email}`);
        } catch (error) {
          retryFailedContacts.push(messageContact); // Enregistrer si l'envoi échoue à nouveau
          console.error(`Échec du renvoi au contact: ${messageContact.contact.email}`, error);
        }
      });
  
      // Attendre que toutes les tentatives soient terminées
      await Promise.all(retryPromises);
  
      // Mise à jour des contacts échoués après la tentative de renvoi
      if (retryFailedContacts.length > 0) {
        await Promise.all(retryFailedContacts.map(async (contact) => {
          await this.prisma.messageContact.updateMany({
            where: { contact_id: contact.contact_id },
            data: {
              hasRecevedMsg: false,
              updated_at: new Date(),
            },
          });
        }));
      }
  
      // Retourner un résumé de l'opération
      return `Tentatives de renvoi terminées. Contacts échoués : ${retryFailedContacts.length}.`;
  
    } catch (error) {
      console.error('Erreur lors du renvoi des messages échoués:', error);
      throw new InternalServerErrorException('Erreur lors du renvoi des messages. Veuillez réessayer plus tard.');
    }
  }


  async scheduleMessageCreate(scheduleMessageDto: ScheduleMessageDto) {
    const currentDate = new Date();
    console.log(currentDate)

    const { messageId, scheduledDate } = scheduleMessageDto;

    // Conversion de la chaîne de caractères en objet Date si nécessaire
    if (typeof scheduledDate === 'string') {
      scheduleMessageDto.scheduledDate = new Date(scheduledDate);
      if (isNaN(scheduleMessageDto.scheduledDate.getTime())) {
        throw new BadRequestException("La date programmée n'est pas valide.");
      }
    }

    if (isNaN(messageId)) {
      console.error(`ID du message non valide: ${messageId}`);
      throw new BadRequestException("L'ID du message est invalide. Veuillez fournir un ID numérique valide.");
    }

    try {
      // Récupérer le message
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return `Le message avec l'ID ${messageId} n'existe pas.`;
      }

      if (message.deleted) {
        return `Le message avec l'ID ${messageId} a déjà été supprimé.`;
      }


   
      
      // Mise à jour du message pour planifier l'envoi
      await this.prisma.message.update({
        where: { id: messageId },
        data: {status: "PENDING" , scheduled: true, scheduled_date: scheduleMessageDto.scheduledDate },
      });

      return `Message avec l'ID ${messageId} programmé pour le ${scheduleMessageDto.scheduledDate}.`;

    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la création du message. Veuillez réessayer plus tard.');
    }
}



// Cron job pour vérifier et envoyer les messages programmés
@Cron("*/5 * * * * *") // Vérification toutes les 5 secondes
async sendScheduledMessages() {

    const currentDate = new Date();

    // Récupérer les messages programmés pour envoi
    const messages = await this.prisma.message.findMany({
        where: {
            scheduled: true,
            scheduled_date: { lte: currentDate }, // Messages dont la date de programmation est arrivée
        },
    });


    // Pour chaque message programmé, appeler sendMessage
    for (const message of messages) {
        
        await this.sendMessage(message.id);

        // Mettre à jour le message après l'envoi pour éviter les envois répétés
        await this.prisma.message.update({
            where: { id: message.id },
            data: { scheduled: false }, // Désactiver le flag 'scheduled' après l'envoi
        });

    }

}

















































































  
  
}
