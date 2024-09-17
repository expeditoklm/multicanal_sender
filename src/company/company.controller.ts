import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto ';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Entreprises')  // Catégorie Swagger pour les entreprises
@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle entreprise' })  // Résumé pour Swagger
    @ApiBody({ description: 'Données pour créer une entreprise', type: CreateCompanyDto })  // Corps de la requête attendu
    async create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les entreprises' })  // Décrit l'opération d'obtention de toutes les entreprises
    async findAll() {
        return this.companyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une entreprise par son ID' })  // Décrit l'opération pour obtenir une entreprise spécifique
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise' })  // Paramètre ID
    async findOne(@Param('id') id: string) {
        return this.companyService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une entreprise existante' })  // Décrit l'opération de mise à jour
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise à mettre à jour' })  // Paramètre ID
    @ApiBody({ description: 'Données pour mettre à jour l\'entreprise', type: UpdateCompanyDto })  // Corps de la requête attendu
    async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companyService.update(+id, updateCompanyDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Supprimer une entreprise' })  // Décrit l'opération de suppression
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise à supprimer' })  // Paramètre ID
    async remove(@Param('id') id: string) {
        return this.companyService.remove(+id);
    }
}
