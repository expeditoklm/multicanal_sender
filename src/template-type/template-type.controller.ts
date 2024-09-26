import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';
import { CreateTemplateTypeDto } from './dto/createTemplateType.dto';
import { UpdateTemplateTypeDto } from './dto/updateTemplateType.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('TemplateTypes') // Catégorie Swagger pour les types de modèles
@Controller('templateTypes')
export class TemplateTypeController {
  constructor(private readonly templateTypeService: TemplateTypeService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau type de modèle' })
  @ApiBody({ description: 'Données pour créer un type de modèle', type: CreateTemplateTypeDto })
  @ApiResponse({ status: 201, description: 'Type de modèle créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Le label est requis.' })
  @ApiResponse({ status: 409, description: 'Un TemplateType avec ce label existe déjà.' })
  async create(@Body() createTemplateTypeDto: CreateTemplateTypeDto) {
    return this.templateTypeService.create(createTemplateTypeDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Obtenir tous les types de modèles' })
  @ApiResponse({ status: 200, description: 'Types de modèles obtenus avec succès.' })
  async findAll() {
    return this.templateTypeService.findAll();
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un type de modèle par son ID' })
  @ApiParam({ name: 'id', description: 'ID du type de modèle' })
  @ApiResponse({ status: 200, description: 'Type de modèle trouvé.' })
  @ApiResponse({ status: 404, description: 'Type de modèle non trouvé.' })
  async findOne(@Param('id') id: number) {
    return this.templateTypeService.findOne(+id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un type de modèle' })
  @ApiParam({ name: 'id', description: 'ID du type de modèle à mettre à jour' })
  @ApiBody({ description: 'Données pour mettre à jour le type de modèle', type: UpdateTemplateTypeDto })
  @ApiResponse({ status: 200, description: 'Type de modèle mis à jour.' })
  @ApiResponse({ status: 404, description: 'Type de modèle non trouvé.' })
  async update(@Param('id') id: number, @Body() updateTemplateTypeDto: UpdateTemplateTypeDto) {
    return this.templateTypeService.update(+id, updateTemplateTypeDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un type de modèle' })
  @ApiParam({ name: 'id', description: 'ID du type de modèle à supprimer' })
  @ApiResponse({ status: 200, description: 'Type de modèle supprimé.' })
  @ApiResponse({ status: 404, description: 'Type de modèle non trouvé.' })
  async remove(@Param('id') id: number) {
    return this.templateTypeService.remove(+id);
  }
}
