// channel.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/createChannelDto';
import { UpdateChannelDto } from './dto/updateChannelDto';
import { AddTemplateToChannelDto } from './dto/addTemplateToChannelDto';


@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  create(createChannelDto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: {
        ...createChannelDto,
        deleted: createChannelDto.deleted || false, // Gérer le cas où "deleted" est omis
      },
    });
  }

  findAll() {
    return this.prisma.channel.findMany({
      where: {
        deleted: false,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.channel.findUnique({
      where: { id },
    });
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: { id },
      data: updateChannelDto,
    });
  }



  remove(id: number) {
    return this.prisma.channel.update({
      where: { id },
      data: { deleted: true },
    });
  }



   // Trouver tous les messages d'un canal spécifique
   findMessagesByChannel(channel_id: number) {
    return this.prisma.message.findMany({
      where: {
        channel_id, // Le champ channelId doit correspondre à celui dans le modèle de message
      },
    });
  }

 





}
