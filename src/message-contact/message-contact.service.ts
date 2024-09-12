import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageContactDto } from './dto/createMessageContactDto';
import { UpdateMessageContactDto } from './dto/updateMessageContactDto';
@Injectable()
export class MessageContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageContactDto: CreateMessageContactDto) {
    return this.prisma.messageContact.create({
      data: createMessageContactDto,
    });
  }

  async findAll() {
    return this.prisma.messageContact.findMany({
      where: { deleted: false },
      include: {
        message: true,
        contact: true,
        interact_type: true,
      },
    });
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const messageContact = await this.prisma.messageContact.findUnique({
      where: { id },
      include: {
        message: true,
        contact: true,
        interact_type: true,
      },
    });

    if (!messageContact) {
      throw new NotFoundException(`MessageContact with ID ${id} not found`);
    }

    return messageContact;
  }

  async update(id: number, updateMessageContactDto: UpdateMessageContactDto) {
    const messageContact = await this.prisma.messageContact.update({
      where: { id },
      data: updateMessageContactDto,
    });

    if (!messageContact) {
      throw new NotFoundException(`MessageContact with ID ${id} not found or already deleted`);
    }

    return messageContact;
  }

  async remove(id: number) {
    const messageContact = await this.prisma.messageContact.findUnique({
      where: { id },
    });

    if (!messageContact) {
      throw new NotFoundException(`MessageContact with ID ${id} not found`);
    }

    return this.prisma.messageContact.update({
      where: { id },
      data: { deleted: true },
    });
  }





// Nouvelle méthode: Trouver les audiences associées à un contact
async findAudiencesByContact(contactId: number) {
    const audiences = await this.prisma.messageContact.findMany({
      where: {
        contact_id: contactId,
        deleted: false,
      },
      include: {
        interact_type: true,  // Inclure les types d'interaction (audiences)
      },
    });

    if (!audiences || audiences.length === 0) {
      throw new NotFoundException(`No audiences found for Contact ID ${contactId}`);
    }

    return audiences.map(audience => audience.interact_type);
  }

  // Nouvelle méthode: Trouver les contacts associés à une audience spécifique
  async findContactsByAudience(audienceId: number) {
    const contacts = await this.prisma.messageContact.findMany({
      where: {
        interact_type_id: audienceId,
        deleted: false,
      },
      include: {
        contact: true,  // Inclure les informations de contact
      },
    });

    if (!contacts || contacts.length === 0) {
      throw new NotFoundException(`No contacts found for Audience ID ${audienceId}`);
    }

    return contacts.map(contact => contact.contact);
  }


















}
