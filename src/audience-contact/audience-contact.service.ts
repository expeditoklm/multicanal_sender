import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAudienceContactDto } from './dto/createAudienceContact.dto';

@Injectable()
export class AudienceContactService {
  constructor(private readonly prisma: PrismaService) { }

  // Créer une nouvelle relation audience-contact
  async create(createAudienceContactDto: CreateAudienceContactDto,userId : number) {
    const { audience_id, contact_id } = createAudienceContactDto;


    

    // Vérifier la validité des IDs
    if (isNaN(audience_id) || audience_id <= 0) {
      throw new BadRequestException('L\'ID de l\'audience doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(contact_id) || contact_id <= 0) {
      throw new BadRequestException('L\'ID du contact doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence des audiences et contacts
    const audienceExists = await this.prisma.audience.findUnique({ where: { id: audience_id } });
    if (!audienceExists) {
      throw new NotFoundException(`Aucune audience trouvée avec l'ID ${audience_id}.`);
    }

    const contactExists = await this.prisma.contact.findUnique({ where: { id: contact_id } });
    if (!contactExists) {
      throw new NotFoundException(`Aucun contact trouvé avec l'ID ${contact_id}.`);
    }


        // Vérification de l'existence de l'utilisateur dans la compagnie
      const userIsInCompany = await this.prisma.userCompany.findFirst({
        where: {
          company_id: audienceExists.company_id,
          user_id: userId,
        },
      });
  
      if (!userIsInCompany) {
        throw new BadRequestException('Vous ne pouvez pas ajouté ce(s) contacts a cette audience.');
      }


    // Créer la relation
    try {
      const result =  await this.prisma.audienceContact.create({
        data: createAudienceContactDto,
      });
      return { message: "Utilisateur ajouté a l\ ' audiance avec succès", result };

    } catch (error) {
      throw new BadRequestException('Erreur lors de la création de la relation audience-contact. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer toutes les relations audience-contact
  async findAll() {
    try {
      return await this.prisma.audienceContact.findMany({
        include: {
          audience: true,
          contact: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des relations audience-contact. Veuillez réessayer plus tard.');
    }
  }

  // Récupérer une relation audience-contact spécifique
  async findOne(audience_id: number, contact_id: number) {
    // Vérifier la validité des IDs
    if (isNaN(audience_id) || audience_id <= 0) {
      throw new BadRequestException('L\'ID de l\'audience doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(contact_id) || contact_id <= 0) {
      throw new BadRequestException('L\'ID du contact doit être un nombre valide supérieur à zéro.');
    }

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
      throw new NotFoundException(`Relation entre l'ID d'audience ${audience_id} et l'ID de contact ${contact_id} non trouvée.`);
    }

    return audienceContact;
  }

  // Supprimer une relation audience-contact
  async remove(audience_id: number, contact_id: number) {
    // Vérifier la validité des IDs
    if (isNaN(audience_id) || audience_id <= 0) {
      throw new BadRequestException('L\'ID de l\'audience doit être un nombre valide supérieur à zéro.');
    }
    if (isNaN(contact_id) || contact_id <= 0) {
      throw new BadRequestException('L\'ID du contact doit être un nombre valide supérieur à zéro.');
    }

    // Vérifier l'existence de la relation
    const relationExists = await this.prisma.audienceContact.findUnique({
      where: {
        audience_id_contact_id: { audience_id, contact_id },  // ID composite
      },
    });

    if (!relationExists) {
      throw new NotFoundException(`Aucune relation trouvée pour l'ID d'audience ${audience_id} et l'ID de contact ${contact_id}.`);
    }

    // Supprimer la relation
    try {
      return await this.prisma.audienceContact.delete({
        where: {
          audience_id_contact_id: { audience_id, contact_id },  // ID composite
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression de la relation audience-contact. Veuillez réessayer plus tard.');
    }
  }
}
