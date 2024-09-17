import { Injectable, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContactDto } from './dto/updateContactDto';
import { CreateContactDto } from './dto/createContactDto';
import { FindContactByEmailDto } from './dto/findContactByEmailDto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un contact
  async create(createContactDto: CreateContactDto) {
    try {
      if (!createContactDto.email || !createContactDto.phone) {
        throw new BadRequestException('L\'email et le téléphone sont requis pour créer un contact.');
      }

      const existingContact = await this.prisma.contact.findUnique({
        where: { email: createContactDto.email },
      });

      if (existingContact) {
        throw new ConflictException('Un contact avec cet email existe déjà.');
      }

      return await this.prisma.contact.create({
        data: {
          ...createContactDto,
          deleted: false,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Les données fournies pour la création du contact sont incorrectes.');
      } else if (error instanceof ConflictException) {
        throw new ConflictException('Conflit lors de la création du contact : email déjà utilisé.');
      } else {
        throw new InternalServerErrorException('Erreur interne lors de la création du contact.');
      }
    }
  }

  // Trouver tous les contacts non supprimés
  async findAll() {
    try {
      return await this.prisma.contact.findMany({
        where: { deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des contacts.');
    }
  }

  // Trouver un contact spécifique par son ID
  async findOne(id: number) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Contact non trouvé.');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Aucun contact ne correspond à cet identifiant.');
      } else {
        throw new InternalServerErrorException('Erreur interne lors de la récupération du contact.');
      }
    }
  }

  // Mettre à jour un contact
  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Contact non trouvé pour la mise à jour.');
      }

      return await this.prisma.contact.update({
        where: { id },
        data: updateContactDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Le contact à mettre à jour n\'existe pas.');
      } else {
        throw new InternalServerErrorException('Erreur interne lors de la mise à jour du contact.');
      }
    }
  }

  // Supprimer un contact (suppression logique)
  async remove(id: number) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Contact non trouvé pour la suppression.');
      }

      return await this.prisma.contact.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Le contact à supprimer n\'existe pas.');
      } else {
        throw new InternalServerErrorException('Erreur interne lors de la suppression du contact.');
      }
    }
  }

  // Trouver tous les audiences associés à un contact
  async findAudiencesByContact(contact_id: number) {
    try {
      return await this.prisma.audienceContact.findMany({
        where: {
          contact_id,
        },
        include: {
          audience: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des audiences pour ce contact.');
    }
  }

  // Trouver tous les messages associés à un contact
  async findMessagesByContact(contact_id: number) {
    try {
      return await this.prisma.messageContact.findMany({
        where: {
          contact_id,
        },
        include: {
          message: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des messages pour ce contact.');
    }
  }

  // Trouver un contact par email ou d'autres attributs
  async findContactByEmail(findContactByEmailDto: FindContactByEmailDto) {
    try {
      const { email, name, username, phone } = findContactByEmailDto;
      return await this.prisma.contact.findMany({
        where: {
          email: email ? email : undefined,
          name: name ? name : undefined,
          username: username ? username : undefined,
          phone: phone ? phone : undefined,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la recherche du contact par email ou autres attributs.');
    }
  }

  // Méthode pour obtenir les messages d'un contact d'une audience, et optionnellement par campagne et/ou canal
  async getMessagesByContactAudienceCampaignChannel(
    contactId: number, 
    audienceId: number, 
    campaignId?: number, 
    channelId?: number
  ) {
    try {
      const whereClause: any = {
        contact_id: contactId,
        contact: {
          audienceContacts: {
            some: {
              audience_id: audienceId,
            },
          },
        },
      };

      if (campaignId) {
        whereClause.message = { ...whereClause.message, campaign_id: campaignId };
      }

      if (channelId) {
        whereClause.message = { ...whereClause.message, channel_id: channelId };
      }

      return await this.prisma.messageContact.findMany({
        where: whereClause,
        include: { message: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des messages pour ce contact, audience, campagne ou canal.');
    }
  }
}
