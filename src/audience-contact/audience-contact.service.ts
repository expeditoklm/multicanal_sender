import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAudienceContactDto } from './dto/createAudienceContactDto';

@Injectable()
export class AudienceContactService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer une nouvelle relation audience-contact
  async create(createAudienceContactDto: CreateAudienceContactDto) {
    return this.prisma.audienceContact.create({
      data: createAudienceContactDto,
    });
  }

  // Récupérer toutes les relations audience-contact
  async findAll() {
    return this.prisma.audienceContact.findMany({
      include: {
        audience: true,
        contact: true,
      },
    });
  }

  // Récupérer une relation audience-contact spécifique
  async findOne(audience_id: number, contact_id: number) {
    const audienceContact = await this.prisma.audienceContact.findUnique({
      where: {
        audience_id_contact_id: { audience_id, contact_id },  // ID composite
      },
      include: {
        audience: true,
        contact: true,
      },
    });

    if (!audienceContact) {
      throw new NotFoundException(`Relation between Audience ID ${audience_id} and Contact ID ${contact_id} not found`);
    }

    return audienceContact;
  }

  // Supprimer une relation audience-contact
  async remove(audience_id: number, contact_id: number) {
    return this.prisma.audienceContact.delete({
      where: {
        audience_id_contact_id: { audience_id, contact_id },  // ID composite
      },
    });
  }
}
