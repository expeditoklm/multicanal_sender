import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ActivateCompanyDto } from './dto/activateCompany.dto';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';


@ApiTags('Entreprises')  // Catégorie Swagger pour les entreprises
@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle entreprise' })  // Résumé pour Swagger
    @ApiBody({ description: 'Données pour créer une entreprise', type: CreateCompanyDto })  // Corps de la requête attendu
    async create(@Body() createCompanyDto: CreateCompanyDto, @Req() request: Request) {
        const userId = request.user['id'];
        return this.companyService.create(createCompanyDto, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les entreprises' })  // Décrit l'opération d'obtention de toutes les entreprises
    async findAll(@Req() request: Request) {
        console.log('request  from angular front:', request.user); 
        return this.companyService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une entreprise par son ID' })  // Décrit l'opération pour obtenir une entreprise spécifique
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise' })  // Paramètre ID
    async findOne(@Param('id') id: string) {
        return this.companyService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une entreprise existante' })  // Décrit l'opération de mise à jour
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise à mettre à jour' })  // Paramètre ID
    @ApiBody({ description: 'Données pour mettre à jour l\'entreprise', type: UpdateCompanyDto })  // Corps de la requête attendu
    async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companyService.update(+id, updateCompanyDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    @ApiOperation({ summary: 'Supprimer une entreprise' })  // Décrit l'opération de suppression
    @ApiParam({ name: 'id', description: 'ID de l\'entreprise à supprimer' })  // Paramètre ID
    async remove(@Param('id') id: string) {
        return this.companyService.remove(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle entreprise' })  // Résumé pour Swagger
    @ApiBody({ description: 'Données pour créer une entreprise', type: CreateCompanyDto })  // Corps de la requête attendu
    async activateCompany(@Body() activateCompanyDto: ActivateCompanyDto) {
        return this.companyService.activateCompany(activateCompanyDto);
    }
}
