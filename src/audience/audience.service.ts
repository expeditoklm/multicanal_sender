// audience.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAudienceDto } from './dto/createAudience.dto';
import { UpdateAudienceDto } from './dto/updateAudience.dto';

@Injectable()
export class AudienceService {
  constructor(private readonly prisma: PrismaService) { }

  // Créer une audience
  async create(createAudienceDto: CreateAudienceDto) {
    try {
      const audience = await this.prisma.audience.create({
        data: {
          ...createAudienceDto,
          deleted: false,
        },
      });
      return { message: 'Audience créée avec succès', audience };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Une audience avec ce nom existe déjà.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Erreur lors de la création de l’audience. Veuillez vérifier les informations.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Trouver toutes les audiences
  async findAll() {
    try {
      const audiences = await this.prisma.audience.findMany({
        where: { deleted: false },
      });
      return { message: 'Audiences récupérées avec succès', audiences };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des audiences. Veuillez réessayer plus tard.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Trouver une audience spécifique
  async findOne(id: number) {
    try {
      const audience = await this.prisma.audience.findUnique({ where: { id } });
      if (!audience) {
        return 'Audience introuvable. Vérifiez l’identifiant.';
      }
      return { message: 'Audience trouvée avec succès', audience };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la recherche de l’audience. Veuillez vérifier l’identifiant fourni.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Mettre à jour une audience
  async update(id: number, updateAudienceDto: UpdateAudienceDto) {
    try {
      const audience = await this.prisma.audience.update({
        where: { id },
        data: updateAudienceDto,
      });
      return { message: 'Audience mise à jour avec succès', audience };
    } catch (error) {
      if (error.code === 'P2025') {
        return 'Audience introuvable. Impossible de mettre à jour.';
      }
      throw new HttpException(
        'Erreur lors de la mise à jour de l’audience. Vérifiez les données fournies.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Supprimer (désactiver) une audience
  async remove(id: number) {
    try {
      const audience = await this.prisma.audience.update({
        where: { id },
        data: { deleted: true },
      });
      return { message: 'Audience supprimée avec succès', audience };
    } catch (error) {
      if (error.code === 'P2025') {
        return 'Audience introuvable. Impossible de supprimer.';
      }
      throw new HttpException(
        'Erreur lors de la suppression de l’audience. Veuillez réessayer plus tard.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Trouver tous les messages associés à une audience spécifique
  async findMessagesByAudience(audience_id: number) {
    try {
      const messages = await this.prisma.message.findMany({
        where: { audience_id },
      });
      if (!messages.length) {
        return 'Aucun message trouvé pour cette audience.';
      }
      return { message: 'Messages récupérés avec succès', messages };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des messages. Veuillez vérifier l’identifiant de l’audience.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Trouver tous les contacts associés à une audience spécifique
  async findContactsByAudience(audience_id: number) {
    try {
      const contacts = await this.prisma.audienceContact.findMany({
        where: { audience_id },
      });
      if (!contacts.length) {
        return 'Aucun contact trouvé pour cette audience.';
      }
      return { message: 'Contacts récupérés avec succès', contacts };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des contacts. Veuillez vérifier l’identifiant de l’audience.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Associer un contact à une audience
  async addContactToAudience(contactId: number, audienceId: number) {
    try {
      const contact = await this.prisma.audienceContact.create({
        data: {
          contact_id: contactId,
          audience_id: audienceId,
        },
      });
      return { message: 'Contact ajouté à l’audience avec succès', contact };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new HttpException('Le contact ou l’audience n’existe pas.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Erreur lors de l’ajout du contact à l’audience. Veuillez vérifier les identifiants fournis.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Associer un tableau de contacts à une audience
  async associateContacts(audienceId: number, contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[]) {
    try {
      const audience = await this.prisma.audience.findUnique({ where: { id: audienceId } });
      if (!audience) {
        return 'Audience introuvable. Impossible d’associer les contacts.';
      }

      for (const contact of contacts) {
        const contactRecord = await this.prisma.contact.upsert({
          where: { email: contact.email },
          update: { name: contact.name, phone: contact.phone ?? '' },
          create: {
            email: contact.email,
            name: contact.name,
            phone: contact.phone ?? '',
            username: contact.username ?? '',
            source: contact.source ?? '',
          },
        });

        await this.prisma.audienceContact.upsert({
          where: { audience_id_contact_id: { audience_id: audienceId, contact_id: contactRecord.id } },
          update: {},
          create: { audience_id: audienceId, contact_id: contactRecord.id },
        });
      }

      return { message: 'Contacts associés à l’audience avec succès' };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de l’association des contacts à l’audience. Veuillez vérifier les données fournies.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
