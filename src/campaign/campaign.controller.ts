import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { UpdateCampaignDto } from './dto/updateCampaign.dto';
import { ExtendCampaignDto } from './dto/extendCampaign.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Campagnes') // Groupe de routes sous le tag 'Campagnes'
@Controller('campaigns')
export class CampaignController {

    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle campagne' }) // Décrit l’opération de création
    @ApiBody({ description: 'Données pour créer une campagne', type: CreateCampaignDto }) // Décrit le corps de la requête pour créer une campagne
    create(@Body() createCampaignDto: CreateCampaignDto) {
        return this.campaignService.create(createCampaignDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les campagnes' }) // Décrit l’opération pour obtenir toutes les campagnes
    findAll() {
        return this.campaignService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une campagne par son ID' }) // Décrit l’opération pour obtenir une campagne spécifique
    @ApiParam({ name: 'id', description: 'ID de la campagne' }) // Décrit le paramètre ID
    findOne(@Param('id') id: number) {
        return this.campaignService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une campagne existante' }) // Décrit l’opération de mise à jour
    @ApiParam({ name: 'id', description: 'ID de la campagne à mettre à jour' }) // Paramètre ID
    @ApiBody({ description: 'Données pour mettre à jour la campagne', type: UpdateCampaignDto }) // Corps de la requête pour la mise à jour
    update(@Param('id') id: number, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignService.update(+id, updateCampaignDto);
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Obtenir les campagnes d’un utilisateur' }) // Décrit l’opération pour obtenir les campagnes par utilisateur
    @ApiParam({ name: 'userId', description: 'ID de l’utilisateur' }) // Paramètre ID utilisateur
    findCampaignsByUser(@Param('userId') userId: number) {
        return this.campaignService.findCampaignsByUser(+userId);
    }

    @Get('/status/:status')
    @ApiOperation({ summary: 'Obtenir les campagnes par statut' }) // Décrit l’opération pour obtenir les campagnes par statut
    @ApiParam({ name: 'status', description: 'Statut des campagnes' }) // Paramètre statut
    findCampaignsByStatus(@Param('status') status: string) {
        return this.campaignService.findCampaignsByStatus(status as any); // Cast vers CampaignStatus
    }

    @Patch('/extend/:id')
    @ApiOperation({ summary: 'Prolonger une campagne' }) // Décrit l’opération de prolongation
    @ApiParam({ name: 'id', description: 'ID de la campagne à prolonger' }) // Paramètre ID campagne
    @ApiBody({ description: 'Nouvelle date de fin de la campagne', type: ExtendCampaignDto }) // Corps de la requête pour prolonger
    extendCampaign(@Param('id') id: number, @Body() extendCampaignDto: ExtendCampaignDto) {
        return this.campaignService.extendCampaign(+id, extendCampaignDto.newEndDate);
    }

    @Patch('/cancel/:id')
    @ApiOperation({ summary: 'Annuler une campagne' }) // Décrit l’opération d’annulation
    @ApiParam({ name: 'id', description: 'ID de la campagne à annuler' }) // Paramètre ID
    cancelCampaign(@Param('id') id: number) {
        return this.campaignService.cancelCampaign(+id);
    }

    @Patch('/complete/:id')
    @ApiOperation({ summary: 'Marquer une campagne comme complétée' }) // Décrit l’opération de complétion
    @ApiParam({ name: 'id', description: 'ID de la campagne à compléter' }) // Paramètre ID
    completeCampaign(@Param('id') id: number) {
        return this.campaignService.completeCampaign(+id);
    }

    @Get('/company/:companyId')
    @ApiOperation({ summary: 'Obtenir les campagnes d’une entreprise' }) // Décrit l’opération pour obtenir les campagnes par entreprise
    @ApiParam({ name: 'companyId', description: 'ID de l’entreprise' }) // Paramètre ID entreprise
    findCampaignsByCompany(@Param('companyId') companyId: number) {
        return this.campaignService.findCampaignsByCompany(+companyId);
    }
}
