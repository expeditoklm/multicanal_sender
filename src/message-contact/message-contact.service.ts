import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageContactDto } from './dto/createMessageContactDto';
import { UpdateMessageContactDto } from './dto/updateMessageContactDto';

@Injectable()
export class MessageContactService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un nouveau MessageContact
  async create(createMessageContactDto: CreateMessageContactDto) {
    // Vérifier que tous les champs requis sont fournis
    if (!createMessageContactDto.interact_date || !createMessageContactDto.message_id || 
        !createMessageContactDto.contact_id || !createMessageContactDto.interact_type_id) {
      throw new BadRequestException('Tous les champs (date d\'interaction, ID du message, ID du contact et ID du type d\'interaction) sont requis.');
    }

    // Vérifier que les IDs sont des nombres valides
    if (isNaN(createMessageContactDto.message_id) || createMessageContactDto.message_id <= 0 ||
        isNaN(createMessageContactDto.contact_id) || createMessageContactDto.contact_id <= 0 ||
        isNaN(createMessageContactDto.interact_type_id) || createMessageContactDto.interact_type_id <= 0) {
      throw new BadRequestException('Les IDs fournis doivent être des nombres valides supérieurs à zéro.');
    }

    // Vérifier l'existence des IDs et que l'attribut deleted n'est pas true
    const [message, contact, interactType] = await Promise.all([
      this.prisma.message.findUnique({ where: { id: createMessageContactDto.message_id, deleted: false } }),
      this.prisma.contact.findUnique({ where: { id: createMessageContactDto.contact_id, deleted: false } }),
      this.prisma.interactType.findUnique({ where: { id: createMessageContactDto.interact_type_id, deleted: false } })
    ]);

    if (!message) {
      throw new BadRequestException('Le message avec l\'ID fourni n\'existe pas ou est marqué comme supprimé.');
    }
    if (!contact) {
      throw new BadRequestException('Le contact avec l\'ID fourni n\'existe pas ou est marqué comme supprimé.');
    }
    if (!interactType) {
      throw new BadRequestException('Le type d\'interaction avec l\'ID fourni n\'existe pas ou est marqué comme supprimé.');
    }

    try {
      return await this.prisma.messageContact.create({
        data: createMessageContactDto,
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création du MessageContact. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer tous les MessageContacts
  async findAll() {
    try {
      return await this.prisma.messageContact.findMany({
        where: { deleted: false },
        include: {
          message: true,
          contact: true,
          interact_type: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des MessageContacts. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer un MessageContact par ID
  async findOne(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du MessageContact doit être un nombre valide supérieur à zéro.');
    }

    const messageContact = await this.prisma.messageContact.findUnique({
      where: { id, deleted: false },
      include: {
        message: true,
        contact: true,
        interact_type: true,
      },
    });

    if (!messageContact) {
      throw new NotFoundException(`Aucun MessageContact trouvé avec l'ID ${id} ou il est marqué comme supprimé.`);
    }

    return messageContact;
  }

  // Mettre à jour un MessageContact
  async update(id: number, updateMessageContactDto: UpdateMessageContactDto) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du MessageContact doit être un nombre valide supérieur à zéro.');
    }

    const messageContact = await this.prisma.messageContact.findUnique({ where: { id, deleted: false } });

    if (!messageContact) {
      throw new NotFoundException(`Aucun MessageContact trouvé avec l'ID ${id} ou il est marqué comme supprimé.`);
    }

    try {
      return await this.prisma.messageContact.update({
        where: { id },
        data: updateMessageContactDto,
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du MessageContact. Veuillez réessayer plus tard.');
    }
  }

  // Supprimer un MessageContact
  async remove(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('L\'ID du MessageContact doit être un nombre valide supérieur à zéro.');
    }

    const messageContact = await this.prisma.messageContact.findUnique({ where: { id, deleted: false } });

    if (!messageContact) {
      throw new NotFoundException(`Aucun MessageContact trouvé avec l'ID ${id} ou il est marqué comme supprimé.`);
    }

    try {
      return await this.prisma.messageContact.update({
        where: { id },
        data: { deleted: true },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression du MessageContact. Veuillez réessayer plus tard.');
    }
  }

  // Trouver les audiences associées à un contact
  async findAudiencesByContact(contactId: number) {
    if (isNaN(contactId) || contactId <= 0) {
      throw new BadRequestException('L\'ID du contact doit être un nombre valide supérieur à zéro.');
    }

    const audiences = await this.prisma.messageContact.findMany({
      where: {
        contact_id: contactId,
        deleted: false,
      },
      include: {
        interact_type: true,
      },
    });

    if (!audiences || audiences.length === 0) {
      throw new NotFoundException(`Aucune audience trouvée pour le Contact ID ${contactId} ou toutes les audiences sont marquées comme supprimées.`);
    }

    return audiences.map(audience => audience.interact_type);
  }

  // Trouver les contacts associés à une audience spécifique
  async findContactsByAudience(audienceId: number) {
    if (isNaN(audienceId) || audienceId <= 0) {
      throw new BadRequestException('L\'ID de l\'audience doit être un nombre valide supérieur à zéro.');
    }

    const contacts = await this.prisma.messageContact.findMany({
      where: {
        interact_type_id: audienceId,
        deleted: false,
      },
      include: {
        contact: true,
      },
    });

    if (!contacts || contacts.length === 0) {
      throw new NotFoundException(`Aucun contact trouvé pour l'Audience ID ${audienceId} ou tous les contacts sont marqués comme supprimés.`);
    }

    return contacts.map(contact => contact.contact);
  }
}
