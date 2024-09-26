// channel.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import {  AddTemplateTypeToChannelDto } from './dto/addTemplateTypeToChannel.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) { }

  // Créer un canal
  async create(createChannelDto: CreateChannelDto) {
    if (!createChannelDto.label) {
      throw new HttpException('Le label du canal est obligatoire.', HttpStatus.BAD_REQUEST);
    }

    try {
      const channel = await this.prisma.channel.create({
        data: {
          ...createChannelDto,
          deleted: createChannelDto.deleted || false,
        },
      });
      return { message: 'Canal créé avec succès', channel };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Le label du canal existe déjà. Veuillez choisir un autre label.', HttpStatus.CONFLICT);
      } else if (error.message.includes('Invalid data')) {
        throw new HttpException('Données invalides pour créer le canal.', HttpStatus.BAD_REQUEST);
      } else if (error.message.includes('Cannot connect to database')) {
        throw new HttpException('Impossible de se connecter à la base de données.', HttpStatus.SERVICE_UNAVAILABLE);
      }
      throw new HttpException('Erreur inconnue lors de la création du canal.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Trouver tous les canaux
  async findAll() {
    try {
      const channels = await this.prisma.channel.findMany({
        where: { deleted: false },

      });
      if (channels.length === 0) {
        return 'Aucun canal trouvé.';
      }
      return { message: 'Canaux récupérés avec succès', channels };
    } catch (error) {
      if (error.message.includes('Network error')) {
        throw new HttpException('Erreur réseau lors de la récupération des canaux.', HttpStatus.GATEWAY_TIMEOUT);
      } else if (error.message.includes('Permission denied')) {
        throw new HttpException('Accès refusé. Vous n\'avez pas la permission de consulter ces canaux.', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Erreur lors de la récupération des canaux.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Trouver un canal par ID
  async findOne(id: number) {
    if (!id) {
      throw new HttpException('L\'identifiant du canal est requis.', HttpStatus.BAD_REQUEST);
    }

    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id },
      });
      if (!channel) {
        return'Canal introuvable avec cet identifiant.';
      }
      return { message: 'Canal trouvé avec succès', channel };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Aucun canal trouvé avec cet identifiant.' , HttpStatus.NOT_FOUND);
      } else if (error.message.includes('Invalid ID')) {
        throw new HttpException('L\'identifiant fourni est invalide.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Erreur lors de la recherche du canal.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Mettre à jour un canal
  async update(id: number, updateChannelDto: UpdateChannelDto) {
    if (!id) {
      throw new HttpException('L\'identifiant du canal est requis pour la mise à jour.', HttpStatus.BAD_REQUEST);
    }
    if (!updateChannelDto.label && !updateChannelDto.deleted) {
      throw new HttpException('Aucune donnée à mettre à jour.', HttpStatus.BAD_REQUEST);
    }

    try {
      const channel = await this.prisma.channel.update({
        where: { id },
        data: updateChannelDto,
      });
      return { message: 'Canal mis à jour avec succès', channel };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Aucun canal trouvé à mettre à jour.' , HttpStatus.NOT_FOUND);
      } else if (error.message.includes('Unique constraint')) {
        throw new HttpException('Le label est déjà utilisé par un autre canal.', HttpStatus.CONFLICT);
      } else if (error.message.includes('Cannot update')) {
        throw new HttpException('Impossible de mettre à jour ce canal en raison de restrictions.', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Erreur inconnue lors de la mise à jour du canal.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Supprimer (désactiver) un canal
  async remove(id: number) {
    if (!id) {
      throw new HttpException('L\'identifiant du canal est requis pour la suppression.', HttpStatus.BAD_REQUEST);
    }

    try {
      const channel = await this.prisma.channel.update({
        where: { id },
        data: { deleted: true },
      });
      return { message: 'Canal supprimé avec succès', channel };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Aucun canal trouvé à supprimer.', HttpStatus.NOT_FOUND);
      } else if (error.message.includes('Cannot delete')) {
        throw new HttpException('Impossible de supprimer ce canal. Il est peut-être utilisé ailleurs.', HttpStatus.CONFLICT);
      }
      throw new HttpException('Erreur lors de la suppression du canal.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Ajouter un template à un canal
  async addTemplateTypeToChannel(channel_id: number, addTemplateTypeToChannelDto: AddTemplateTypeToChannelDto) {
    if (!channel_id || !addTemplateTypeToChannelDto.templateTypeId) {
      throw new HttpException('L\'identifiant du canal et le templateTypeId sont requis.', HttpStatus.BAD_REQUEST);
    }

    try {
      const channel = await this.prisma.channel.update({
        where: { id: channel_id },
        data: {
          template_types: {
            connect: { id: addTemplateTypeToChannelDto.templateTypeId },
          },
        },
      });
      return { message: 'Typpe de Template ajouté au canal avec succès', channel };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Le canal ou le type de template spécifié est introuvable.', HttpStatus.NOT_FOUND);
      } else if (error.message.includes('Unique constraint')) {
        throw new HttpException('Ce type de template est déjà associé à ce canal.', HttpStatus.CONFLICT);
      } else if (error.message.includes('Invalid templateTypeId')) {
        throw new HttpException('Le templateTypeId fourni est invalide.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Erreur lors de l\'ajout du type de template au canal.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
