import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TemplateCampaignService } from './template-campaign.service';
import { CreateTemplateCampaignDto } from './dto/createTemplateCampaignDto';
import { UpdateTemplateCampaignDto } from './dto/updateTemplateCampaignDto';

@Controller('template-campaigns')
export class TemplateCampaignController {
    constructor(private readonly templateCampaignService: TemplateCampaignService) { }

    @Post()
    async create(@Body() createTemplateCampaignDto: CreateTemplateCampaignDto) {
        return this.templateCampaignService.create(createTemplateCampaignDto);
    }

    @Get()
    async findAll() {
        return this.templateCampaignService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.templateCampaignService.findOne(+id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTemplateCampaignDto: UpdateTemplateCampaignDto) {
        return this.templateCampaignService.update(+id, updateTemplateCampaignDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.templateCampaignService.remove(+id);
    }

    @Get('campaign/:campaignId')
    async findByCampaign(@Param('campaignId') campaignId: number) {
        return this.templateCampaignService.findByCampaign(+campaignId);
    }

    @Get('template/:templateId')
    async findByTemplate(@Param('templateId') templateId: number) {
        return this.templateCampaignService.findByTemplate(+templateId);
    }

    @Get('preview/:id')
    async previewTemplateCampaign(@Param('id') templateCampaignId: number) {
        return this.templateCampaignService.previewTemplateCampaign(+templateCampaignId);
    }



    // Route pour obtenir les templates associés à une campagne
    @Get('campaign/:campaignId/templates')
    async findTemplatesByCampaign(@Param('campaignId') campaignId: number) {
        return this.templateCampaignService.findTemplatesByCampaign(+campaignId);
    }

    // Route pour retirer un template d'une campagne
    @Delete('campaign/:campaignId/template/:templateId')
    async removeTemplateFromCampaign(
        @Param('templateId') templateId: number,
        @Param('campaignId') campaignId: number,
    ) {
        return this.templateCampaignService.removeTemplateFromCampaign(+templateId, +campaignId);
    }










}
