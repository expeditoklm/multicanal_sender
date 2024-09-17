import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Templates')  // Catégorie Swagger pour les templates
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau modèle' })  // Résumé pour Swagger
  @ApiBody({ description: 'Données pour créer un modèle', type: CreateTemplateDto })  // Corps de la requête attendu
  @ApiResponse({ status: 201, description: 'Modèle créé avec succès.' })  // Réponse attendue
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les modèles' })  // Décrit l'opération pour obtenir tous les modèles
  @ApiResponse({ status: 200, description: 'Modèles obtenus avec succès.' })  // Réponse attendue
  async findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un modèle par son ID' })  // Décrit l'opération pour obtenir un modèle spécifique
  @ApiParam({ name: 'id', description: 'ID du modèle' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Modèle trouvé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
  async findOne(@Param('id') id: number) {
    return this.templateService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un modèle existant' })  // Décrit l'opération de mise à jour
  @ApiParam({ name: 'id', description: 'ID du modèle à mettre à jour' })  // Paramètre ID
  @ApiBody({ description: 'Données pour mettre à jour le modèle', type: UpdateTemplateDto })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Modèle mis à jour.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
  async update(@Param('id') id: number, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(+id, updateTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un modèle' })  // Décrit l'opération de suppression
  @ApiParam({ name: 'id', description: 'ID du modèle à supprimer' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Modèle supprimé.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
  async remove(@Param('id') id: number) {
    return this.templateService.remove(+id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Appliquer un modèle à une campagne' })  // Décrit l'opération pour appliquer un modèle à une campagne
  @ApiBody({
    description: 'Données pour appliquer un modèle à une campagne',
    schema: {
      type: 'object',
      properties: {
        templateId: { type: 'number', description: 'ID du modèle' },
        campaignId: { type: 'number', description: 'ID de la campagne' },
      },
    },
  })  // Corps de la requête attendu
  @ApiResponse({ status: 200, description: 'Modèle appliqué à la campagne avec succès.' })  // Réponse attendue
  @ApiResponse({ status: 400, description: 'Échec de l\'application du modèle à la campagne.' })  // Réponse en cas d'erreur
  async applyTemplateToCampaign(
    @Body('templateId') templateId: number,
    @Body('campaignId') campaignId: number,
  ) {
    return this.templateService.applyTemplateToCampaign(templateId, campaignId);
  }

  @Get('preview/:id')
  @ApiOperation({ summary: 'Prévisualiser un modèle' })  // Décrit l'opération pour prévisualiser un modèle
  @ApiParam({ name: 'id', description: 'ID du modèle à prévisualiser' })  // Paramètre ID
  @ApiResponse({ status: 200, description: 'Prévisualisation du modèle réussie.' })  // Réponse attendue
  @ApiResponse({ status: 404, description: 'Modèle non trouvé pour la prévisualisation.' })  // Réponse en cas d'erreur
  async previewTemplate(@Param('id') templateId: number) {
    return this.templateService.previewTemplate(+templateId);
  }
}
