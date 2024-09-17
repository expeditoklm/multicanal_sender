import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractTypeDto } from './dto/createInteractType.dto';
import { UpdateInteractTypeDto } from './dto/updateInteractType.dto';

@Injectable()
export class InteractTypeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createInteractTypeDto: CreateInteractTypeDto) {
    return this.prisma.interactType.create({
      data: createInteractTypeDto,
    });
  }

  async findAll() {
    return this.prisma.interactType.findMany({
      where: { deleted: false },
    });
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const interactType = await this.prisma.interactType.findUnique({
      where: { id },
    });

    if (!interactType) {
      throw new NotFoundException(`InteractType with ID ${id} not found`);
    }

    return interactType;
  }

  async update(id: number, updateInteractTypeDto: UpdateInteractTypeDto) {
    const interactType = await this.prisma.interactType.update({
      where: { id },
      data: updateInteractTypeDto,
    });

    if (!interactType) {
      throw new NotFoundException(`InteractType with ID ${id} not found or already deleted`);
    }

    return interactType;
  }

  async remove(id: number) {
    const interactType = await this.prisma.interactType.findUnique({
      where: { id },
    });

    if (!interactType) {
      throw new NotFoundException(`InteractType with ID ${id} not found`);
    }

    return this.prisma.interactType.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
