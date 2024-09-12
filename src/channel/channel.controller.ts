// channel.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/createChannelDto';
import { UpdateChannelDto } from './dto/updateChannelDto';
import { AddTemplateToChannelDto } from './dto/addTemplateToChannelDto';

@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) { }

    @Post()
    create(@Body() createChannelDto: CreateChannelDto) {
        return this.channelService.create(createChannelDto);
    }

    @Get()
    findAll() {
        return this.channelService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.channelService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
        return this.channelService.update(+id, updateChannelDto);
    }

    @Patch(':id')
    remove(@Param('id') id: string) {
        return this.channelService.remove(+id);
    }

    // Obtenir tous les messages d'un canal spécifique
    @Get(':channelId/messages')
    findMessagesByChannel(@Param('channelId') channelId: string) {
        return this.channelService.findMessagesByChannel(+channelId);
    }

 


}
