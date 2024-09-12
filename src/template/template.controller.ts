import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/createTemplateDto';
import { UpdateTemplateDto } from './dto/updateTemplateDto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  async findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.templateService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(+id, updateTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.templateService.remove(+id);
  }




  @Post('apply')
  async applyTemplateToCampaign(
    @Body('templateId') templateId: number,
    @Body('campaignId') campaignId: number,
  ) {
    return this.templateService.applyTemplateToCampaign(templateId, campaignId);
  }

  @Get('preview/:id')
  async previewTemplate(@Param('id') templateId: number) {
    return this.templateService.previewTemplate(+templateId);
  }









}
