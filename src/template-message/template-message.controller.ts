import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TemplateMessageService } from './template-message.service';
import { CreateTemplateMessageDto } from './dto/CreateTemplateMessage.dto';
import { UpdateTemplateMessageDto } from './dto/UpdateTemplateMessage.dto';

import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@ApiTags('TemplateMessages') // Groupe de routes sous le tag 'TemplateMessages'
@Controller('template-messages')
export class TemplateMessageController {
    constructor(private readonly templateMessageService: TemplateMessageService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau TemplateMessage' }) // Swagger summary
    @ApiBody({ description: 'Données pour créer un TemplateMessage', type: CreateTemplateMessageDto }) // Swagger body description
    create(@Body() createTemplateMessageDto: CreateTemplateMessageDto,@Req() request : Request) {
        const userId =  request.user['id'];
        return this.templateMessageService.create(createTemplateMessageDto,userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ summary: 'Récupérer tous les TemplateMessages' }) // Swagger summary
    findAll() {
        return this.templateMessageService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un TemplateMessage par ID' }) // Swagger summary
    @ApiParam({ name: 'id', description: 'ID du TemplateMessage' }) // Swagger parameter
    findOne(@Param('id') id: number) {
        return this.templateMessageService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un TemplateMessage' }) // Swagger summary
    @ApiParam({ name: 'id', description: 'ID du TemplateMessage à mettre à jour' }) // Swagger parameter
    @ApiBody({ description: 'Données pour mettre à jour un TemplateMessage', type: UpdateTemplateMessageDto }) // Swagger body description
    update(@Param('id') id: number, @Body() updateTemplateMessageDto: UpdateTemplateMessageDto) {
        return this.templateMessageService.update(id, updateTemplateMessageDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un TemplateMessage' }) // Swagger summary
    @ApiParam({ name: 'id', description: 'ID du TemplateMessage à supprimer' }) // Swagger parameter
    remove(@Param('id') id: number) {
        return this.templateMessageService.remove(id);
    }
}
