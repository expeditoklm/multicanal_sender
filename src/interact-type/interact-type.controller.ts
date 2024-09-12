import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { InteractTypeService } from './interact-type.service';
import { CreateInteractTypeDto } from './dto/createInteractTypeDto';
import { UpdateInteractTypeDto } from './dto/updateInteractTypeDto';

@Controller('interactTypes')
export class InteractTypeController {
  constructor(private readonly interactTypeService: InteractTypeService) {}

  @Post()
  async create(@Body() createInteractTypeDto: CreateInteractTypeDto) {
    return this.interactTypeService.create(createInteractTypeDto);
  }

  @Get()
  async findAll() {
    return this.interactTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.interactTypeService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateInteractTypeDto: UpdateInteractTypeDto) {
    return this.interactTypeService.update(+id, updateInteractTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.interactTypeService.remove(+id);
  }
}
