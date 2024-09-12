import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { UpdateCampaignDto } from './dto/updateCampaignDto';
import { ExtendCampaignDto } from './dto/extendCampaignDto';

@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Post()
    create(@Body() createCampaignDto: CreateCampaignDto) {
        return this.campaignService.create(createCampaignDto);
    }

    @Get()
    findAll() {
        return this.campaignService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.campaignService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignService.update(+id, updateCampaignDto);
    }

    @Get('/user/:userId')
    findCampaignsByUser(@Param('userId') userId: number) {
        return this.campaignService.findCampaignsByUser(+userId);
    }

    @Get('/status/:status')
    findCampaignsByStatus(@Param('status') status: string) {
        return this.campaignService.findCampaignsByStatus(status as any); // Cast vers CampaignStatus
    }

    @Patch('/extend/:id')
    extendCampaign(@Param('id') id: number, @Body() extendCampaignDto: ExtendCampaignDto) {
        return this.campaignService.extendCampaign(+id, extendCampaignDto.newEndDate);
    }

    @Patch('/cancel/:id')
    cancelCampaign(@Param('id') id: number) {
        return this.campaignService.cancelCampaign(+id);
    }

    @Get('/company/:companyId')
    findCampaignsByCompany(@Param('companyId') companyId: number) {
        return this.campaignService.findCampaignsByCompany(+companyId);
    }
}
