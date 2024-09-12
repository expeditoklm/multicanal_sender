// contact.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContactDto } from './dto/updateContactDto';
import { CreateContactDto } from './dto/createContactDto';
import { FindContactByEmailDto } from './dto/findContactByEmailDto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un contact
  create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        deleted: false,
      },
    });
  }

  // Trouver tous les contacts non supprimés
  findAll() {
    return this.prisma.contact.findMany({
      where: { deleted: false },
    });
  }

  // Trouver un contact spécifique par son ID
  findOne(id: number) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  // Mettre à jour un contact
  update(id: number, updateContactDto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  // Supprimer un contact (suppression logique)
  remove(id: number) {
    return this.prisma.contact.update({
      where: { id },
      data: { deleted: true },
    });
  }

  // Trouver tous les audiences associés à un contact
  findAudiencesByContact(contact_id: number) {
    return this.prisma.audienceContact.findMany({
      where: {
        contact_id,
      },
      include: {
        audience: true,
      },
    });
  }

  // Trouver tous les messages associés à un contact
  findMessagesByContact(contact_id: number) {
    return this.prisma.messageContact.findMany({
      where: {
        contact_id,
      },
      include: {
        message: true,
      },
    });
  }




 // Trouver un contact par email ou d'autres attributs
 findContactByEmail(findContactByEmailDto: FindContactByEmailDto) {
    const { email, name, username, phone } = findContactByEmailDto;
    return this.prisma.contact.findMany({
      where: {
        email: email ? email : undefined,
        name: name ? name : undefined,
        username: username ? username : undefined,
        phone: phone ? phone : undefined,
        deleted: false,
      },
    });
  }

// Méthode pour obtenir les messages d'un contact d'une audience, et optionnellement par campagne et/ou canal
async getMessagesByContactAudienceCampaignChannel(
    contactId: number, 
    audienceId: number, 
    campaignId?: number, 
    channelId?: number
  ) {
    const whereClause: any = {
      contact_id: contactId,  // Remplacer contactId par contact_id
      contact: {
        audienceContacts: {
          some: {
            audience_id: audienceId,  // audienceId doit être audience_id selon ton modèle
          },
        },
      },
    };
  
    // Ajout de la condition de campagne
    if (campaignId) {
      whereClause.message = { ...whereClause.message, campaign_id: campaignId };  // Remplacer campaignId par campaign_id
    }
  
    // Ajout de la condition de canal
    if (channelId) {
      whereClause.message = { ...whereClause.message, channel_id: channelId };  // Remplacer channelId par channel_id
    }
  
    return await this.prisma.messageContact.findMany({
      where: whereClause,
      include: { message: true },
    });
  }
  









}
