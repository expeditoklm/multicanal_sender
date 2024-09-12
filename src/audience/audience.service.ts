// audience.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAudienceDto } from './dto/createAudienceDto';
import { UpdateAudienceDto } from './dto/updateAudienceDto';
@Injectable()
export class AudienceService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer une audience
  create(createAudienceDto: CreateAudienceDto) {
    return this.prisma.audience.create({
      data: {
        ...createAudienceDto,
        deleted: false,
      },
    });
  }

  // Trouver toutes les audiences
  findAll() {
    return this.prisma.audience.findMany({
      where: { deleted: false },
    });
  }

  // Trouver une audience spécifique
  findOne(id: number) {
    return this.prisma.audience.findUnique({
      where: { id },
    });
  }

  // Mettre à jour une audience
  update(id: number, updateAudienceDto: UpdateAudienceDto) {
    return this.prisma.audience.update({
      where: { id },
      data: updateAudienceDto,
    });
  }

  remove(id: number) {
    console.log("Removing audience with id:", id);  // Log the id
    return this.prisma.audience.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
      },
    });
  }
  
  
  

  // Trouver tous les messages associés à une audience spécifique
  findMessagesByAudience(audience_id: number) {
    return this.prisma.message.findMany({
      where: {
        audience_id,
      },
    });
  }

  // Trouver tous les contacts associés à une audience spécifique
  findContactsByAudience(audience_id: number) {
    return this.prisma.audienceContact.findMany({
      where: {
        audience_id,
      },
    });
  }






  // Méthode pour associer un contact à une audience
  async addContactToAudience(contactId: number, audienceId: number) {
    return this.prisma.audienceContact.create({
      data: {
        contact_id: contactId,  // contactId -> contact_id
        audience_id: audienceId,  // audienceId -> audience_id
      },
    });
  }










    //Créer un contrôleur pour recevoir la requête avec la liste des contacts et l'ID de l'audience.
    async associateContacts(audienceId: number, contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[]) {
      console.log('Associating contacts with audience ID:', audienceId);
  
      // Vérifiez si l'audience existe
      const audience = await this.prisma.audience.findUnique({ where: { id: audienceId } });
      if (!audience) {
        throw new Error('Audience not found');
      }
  
      // Associez les contacts à l'audience
      for (const contact of contacts) {
        // Utilisez une clé unique pour la recherche (assurez-vous que le champ est unique dans votre schéma Prisma)
        const contactRecord = await this.prisma.contact.upsert({
          where: { email: contact.email },
          update: { 
            name: contact.name, 
            phone: contact.phone ?? "" // Assurez-vous de fournir toutes les propriétés requises
          },
          create: {
            email: contact.email,
            name: contact.name,
            phone: contact.phone ?? "",
            username: contact.username ?? "",
            source: contact.source ?? "",
          },
        });
  
        // Associez le contact à l'audience
        await this.prisma.audienceContact.upsert({
          where: {
            audience_id_contact_id: {
              audience_id: audienceId,
              contact_id: contactRecord.id,
            },
          },
          update: {},
          create: {
            audience_id: audienceId,
            contact_id: contactRecord.id,
          },
        });
      }
  
      return { message: 'Contacts associated with audience successfully' };
    }




}
