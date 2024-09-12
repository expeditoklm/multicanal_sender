import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';
import { CreateTemplateTypeDto } from './dto/createTemplateTypeDto';
import { UpdateTemplateTypeDto } from './dto/updateTemplateTypeDto';
@Controller('templateTypes')
export class TemplateTypeController {
  constructor(private readonly templateTypeService: TemplateTypeService) {}

  @Post()
  async create(@Body() createTemplateTypeDto: CreateTemplateTypeDto) {
    return this.templateTypeService.create(createTemplateTypeDto);
  }

  @Get()
  async findAll() {
    return this.templateTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.templateTypeService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTemplateTypeDto: UpdateTemplateTypeDto) {
    return this.templateTypeService.update(+id, updateTemplateTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.templateTypeService.remove(+id);
  }
}
