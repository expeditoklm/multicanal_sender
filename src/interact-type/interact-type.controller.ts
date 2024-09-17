import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { InteractTypeService } from './interact-type.service';
import { CreateInteractTypeDto } from './dto/createInteractType.dto';
import { UpdateInteractTypeDto } from './dto/updateInteractType.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('InteractTypes')  // Catégorie Swagger pour les types d'interactions
@Controller('interactTypes')
export class InteractTypeController {
  constructor(private readonly interactTypeService: InteractTypeService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau type d\'interaction' })  // Résumé pour Swagger
  @ApiBody({ description: 'Données pour créer un type d\'interaction', type: CreateInteractTypeDto })  // Corps de la requête attendu
  async create(@Body() createInteractTypeDto: CreateInteractTypeDto) {
    return this.interactTypeService.create(createInteractTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les types d\'interaction' })  // Décrit l'opération pour obtenir tous les types
  @ApiResponse({ status: 200, description: 'Types d\'interaction obtenus avec succès.' })  // Réponse attendue
  async findAll() {
    return this.interactTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un type d\'interaction par son ID' })  // Décrit l'opération pour obtenir un type spécifique
  @ApiParam({ name: 'id', description: 'ID du type d\'interaction' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Type d\'interaction trouvé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Type d\'interaction non trouvé.' })  // Réponse en cas d'erreur
  async findOne(@Param('id') id: number) {
    return this.interactTypeService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un type d\'interaction existant' })  // Décrit l'opération de mise à jour
  @ApiParam({ name: 'id', description: 'ID du type d\'interaction à mettre à jour' })  // Paramètre ID
  @ApiBody({ description: 'Données pour mettre à jour le type d\'interaction', type: UpdateInteractTypeDto })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Type d\'interaction mis à jour.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Type d\'interaction non trouvé.' })  // Réponse en cas d'erreur
  async update(@Param('id') id: number, @Body() updateInteractTypeDto: UpdateInteractTypeDto) {
    return this.interactTypeService.update(+id, updateInteractTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un type d\'interaction' })  // Décrit l'opération de suppression
  @ApiParam({ name: 'id', description: 'ID du type d\'interaction à supprimer' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Type d\'interaction supprimé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Type d\'interaction non trouvé.' })  // Réponse en cas d'erreur
  async remove(@Param('id') id: number) {
    return this.interactTypeService.remove(+id);
  }
}
