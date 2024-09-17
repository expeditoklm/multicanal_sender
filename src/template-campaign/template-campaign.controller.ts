import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TemplateCampaignService } from './template-campaign.service';
import { CreateTemplateCampaignDto } from './dto/createTemplateCampaign.dto';
import { UpdateTemplateCampaignDto } from './dto/updateTemplateCampaign.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('TemplateCampaigns')  // Catégorie Swagger pour les campagnes de modèles
@Controller('template-campaigns')
export class TemplateCampaignController {
    constructor(private readonly templateCampaignService: TemplateCampaignService) { }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle campagne de modèle' })
    @ApiBody({ description: 'Données pour créer une campagne de modèle', type: CreateTemplateCampaignDto })
    @ApiResponse({ status: 201, description: 'Campagne de modèle créée avec succès.' })
    async create(@Body() createTemplateCampaignDto: CreateTemplateCampaignDto) {
        return this.templateCampaignService.create(createTemplateCampaignDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les campagnes de modèles' })
    @ApiResponse({ status: 200, description: 'Campagnes de modèles obtenues avec succès.' })
    async findAll() {
        return this.templateCampaignService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une campagne de modèle par son ID' })
    @ApiParam({ name: 'id', description: 'ID de la campagne de modèle' })
    @ApiResponse({ status: 200, description: 'Campagne de modèle trouvée.' })
    @ApiResponse({ status: 404, description: 'Campagne de modèle non trouvée.' })
    async findOne(@Param('id') id: number) {
        return this.templateCampaignService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une campagne de modèle' })
    @ApiParam({ name: 'id', description: 'ID de la campagne de modèle à mettre à jour' })
    @ApiBody({ description: 'Données pour mettre à jour la campagne de modèle', type: UpdateTemplateCampaignDto })
    @ApiResponse({ status: 200, description: 'Campagne de modèle mise à jour.' })
    @ApiResponse({ status: 404, description: 'Campagne de modèle non trouvée.' })
    async update(@Param('id') id: number, @Body() updateTemplateCampaignDto: UpdateTemplateCampaignDto) {
        return this.templateCampaignService.update(+id, updateTemplateCampaignDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une campagne de modèle' })
    @ApiParam({ name: 'id', description: 'ID de la campagne de modèle à supprimer' })
    @ApiResponse({ status: 200, description: 'Campagne de modèle supprimée.' })
    @ApiResponse({ status: 404, description: 'Campagne de modèle non trouvée.' })
    async remove(@Param('id') id: number) {
        return this.templateCampaignService.remove(+id);
    }

    @Get('campaign/:campaignId')
    @ApiOperation({ summary: 'Obtenir les campagnes de modèles par ID de campagne' })
    @ApiParam({ name: 'campaignId', description: 'ID de la campagne' })
    @ApiResponse({ status: 200, description: 'Campagnes de modèles trouvées.' })
    async findByCampaign(@Param('campaignId') campaignId: number) {
        return this.templateCampaignService.findByCampaign(+campaignId);
    }

    @Get('template/:templateId')
    @ApiOperation({ summary: 'Obtenir les campagnes de modèles par ID de modèle' })
    @ApiParam({ name: 'templateId', description: 'ID du modèle' })
    @ApiResponse({ status: 200, description: 'Campagnes de modèles trouvées.' })
    async findByTemplate(@Param('templateId') templateId: number) {
        return this.templateCampaignService.findByTemplate(+templateId);
    }

    @Get('preview/:id')
    @ApiOperation({ summary: 'Prévisualiser une campagne de modèle' })
    @ApiParam({ name: 'id', description: 'ID de la campagne de modèle à prévisualiser' })
    @ApiResponse({ status: 200, description: 'Prévisualisation de la campagne de modèle réussie.' })
    @ApiResponse({ status: 404, description: 'Campagne de modèle non trouvée pour la prévisualisation.' })
    async previewTemplateCampaign(@Param('id') templateCampaignId: number) {
        return this.templateCampaignService.previewTemplateCampaign(+templateCampaignId);
    }

    @Get('campaign/:campaignId/templates')
    @ApiOperation({ summary: 'Obtenir les modèles associés à une campagne' })
    @ApiParam({ name: 'campaignId', description: 'ID de la campagne' })
    @ApiResponse({ status: 200, description: 'Modèles associés à la campagne trouvés.' })
    async findTemplatesByCampaign(@Param('campaignId') campaignId: number) {
        return this.templateCampaignService.findTemplatesByCampaign(+campaignId);
    }

    @Delete('campaign/:campaignId/template/:templateId')
    @ApiOperation({ summary: 'Retirer un modèle d\'une campagne' })
    @ApiParam({ name: 'campaignId', description: 'ID de la campagne' })
    @ApiParam({ name: 'templateId', description: 'ID du modèle à retirer' })
    @ApiResponse({ status: 200, description: 'Modèle retiré de la campagne.' })
    @ApiResponse({ status: 404, description: 'Campagne ou modèle non trouvés.' })
    async removeTemplateFromCampaign(
        @Param('templateId') templateId: number,
        @Param('campaignId') campaignId: number,
    ) {
        return this.templateCampaignService.removeTemplateFromCampaign(+templateId, +campaignId);
    }
}
