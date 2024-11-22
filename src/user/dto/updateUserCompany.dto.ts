import { PartialType } from "@nestjs/swagger";
import { CreateUserCompanyDto } from "./createUserCompany.dto";

// dto/update-user-company.dto.ts
export class UpdateUserCompanyDto extends PartialType(CreateUserCompanyDto) {}
























// redige moi le dto , le controlleur et le service pour gerer le CRUD

// Schemas prisma : 

// model User {
//     id         Int      @id @default(autoincrement())
//     name       String?
//     username   String?
//     email      String   @unique
//     role       String
//     password   String
//     deleted    Boolean  @default(false)
//     created_at DateTime @default(now())
//     updated_at DateTime @updatedAt

//     // Relation with UserCompany
//     userCompanies UserCompany[]

//     // Relation with Campaigns

//     @@map("users")
// }




// model UserCompany {
//     id         Int      @id @default(autoincrement())
//     user_id    Int
//     company_id Int
//     deleted    Boolean  @default(false)
//     created_at DateTime @default(now())
//     updated_at DateTime @updatedAt
//     isMember   Boolean  @default(false)
//     // Relations
//     user    User    @relation(fields: [user_id], references: [id])
//     company Company @relation(fields: [company_id], references: [id])

//     @@unique([user_id, company_id])
//     @@map("user_company")
// }

// prend exemple sur les controlleurs et les services de mon module template
// controlleur : 

// import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
// import { TemplateService } from './template.service';
// import { CreateTemplateDto } from './dto/createTemplate.dto';
// import { UpdateTemplateDto } from './dto/updateTemplate.dto';
// import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

// @ApiTags('Templates')  // Catégorie Swagger pour les templates
// @Controller('templates')
// export class TemplateController {
//   constructor(private readonly templateService: TemplateService) { }


//   @UseGuards(AuthGuard('jwt'))
//   @Post()
//   @ApiOperation({ summary: 'Créer un nouveau modèle' })  // Résumé pour Swagger
//   @ApiBody({ description: 'Données pour créer un modèle', type: CreateTemplateDto })  // Corps de la requête attendu
//   @ApiResponse({ status: 201, description: 'Modèle créé avec succès.' })  // Réponse attendue
//   async create(@Body() createTemplateDto: CreateTemplateDto) {
//     return this.templateService.create(createTemplateDto);
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Get()
//   @ApiOperation({ summary: 'Obtenir tous les modèles' })  // Décrit l'opération pour obtenir tous les modèles
//   @ApiResponse({ status: 200, description: 'Modèles obtenus avec succès.' })  // Réponse attendue
//   async findAll() {
//     return this.templateService.findAll();
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Get(':id')
//   @ApiOperation({ summary: 'Obtenir un modèle par son ID' })  // Décrit l'opération pour obtenir un modèle spécifique
//   @ApiParam({ name: 'id', description: 'ID du modèle' })  // Paramètre ID
//   @ApiResponse({ status: 200, description: 'Modèle trouvé.' })  // Réponse attendue
//   @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
//   async findOne(@Param('id') id: number) {
//     return this.templateService.findOne(+id);
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Put(':id')
//   @ApiOperation({ summary: 'Mettre à jour un modèle existant' })  // Décrit l'opération de mise à jour
//   @ApiParam({ name: 'id', description: 'ID du modèle à mettre à jour' })  // Paramètre ID
//   @ApiBody({ description: 'Données pour mettre à jour le modèle', type: UpdateTemplateDto })  // Corps de la requête attendu
//   @ApiResponse({ status: 200, description: 'Modèle mis à jour.' })  // Réponse attendue
//   @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
//   async update(@Param('id') id: number, @Body() updateTemplateDto: UpdateTemplateDto) {
//     return this.templateService.update(+id, updateTemplateDto);
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Delete(':id')
//   @ApiOperation({ summary: 'Supprimer un modèle' })  // Décrit l'opération de suppression
//   @ApiParam({ name: 'id', description: 'ID du modèle à supprimer' })  // Paramètre ID
//   @ApiResponse({ status: 200, description: 'Modèle supprimé.' })  // Réponse attendue
//   @ApiResponse({ status: 404, description: 'Modèle non trouvé.' })  // Réponse en cas d'erreur
//   async remove(@Param('id') id: number) {
//     return this.templateService.remove(+id);
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Post('apply')
//   @ApiOperation({ summary: 'Appliquer un modèle à une campagne' })  // Décrit l'opération pour appliquer un modèle à une campagne
//   @ApiBody({
//     description: 'Données pour appliquer un modèle à une campagne',
//     schema: {
//       type: 'object',
//       properties: {
//         templateId: { type: 'number', description: 'ID du modèle' },
//         campaignId: { type: 'number', description: 'ID de la campagne' },
//       },
//     },
//   })  // Corps de la requête attendu
//   @ApiResponse({ status: 200, description: 'Modèle appliqué à la campagne avec succès.' })  // Réponse attendue
//   @ApiResponse({ status: 400, description: 'Échec de l\'application du modèle à la campagne.' })  // Réponse en cas d'erreur
//   async applyTemplateToCampaign(
//     @Body('templateId') templateId: number,
//     @Body('campaignId') campaignId: number,
//   ) {
//     return this.templateService.applyTemplateToCampaign(templateId, campaignId);
//   }


//   @UseGuards(AuthGuard('jwt'))
//   @Get('preview/:id')
//   @ApiOperation({ summary: 'Prévisualiser un modèle' })  // Décrit l'opération pour prévisualiser un modèle
//   @ApiParam({ name: 'id', description: 'ID du modèle à prévisualiser' })  // Paramètre ID
//   @ApiResponse({ status: 200, description: 'Prévisualisation du modèle réussie.' })  // Réponse attendue
//   @ApiResponse({ status: 404, description: 'Modèle non trouvé pour la prévisualisation.' })  // Réponse en cas d'erreur
//   async previewTemplate(@Param('id') templateId: number) {
//     return this.templateService.previewTemplate(+templateId);
//   }
// }


// service : 


// import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateTemplateDto } from './dto/createTemplate.dto';
// import { UpdateTemplateDto } from './dto/updateTemplate.dto';

// @Injectable()
// export class TemplateService {
//   constructor(private readonly prisma: PrismaService) {}

//   // Créer un nouveau Template
//   async create(createTemplateDto: CreateTemplateDto) {
//     // Vérification des champs obligatoires
//     const { content, template_type_id, channel_id } = createTemplateDto;

//     if (!content) {
//       throw new BadRequestException('Le champ "contenu" est requis pour créer un modèle.');
//     }
//     if (!template_type_id) {
//       throw new BadRequestException('L\'ID du type de modèle est requis pour créer un modèle.');
//     }
//     if (!channel_id) {
//       throw new BadRequestException('L\'ID du canal est requis pour créer un modèle.');
//     }

//     // Validation des IDs
//     if (isNaN(template_type_id) || template_type_id <= 0) {
//       throw new BadRequestException('L\'ID du type de modèle doit être un nombre valide supérieur à zéro.');
//     }
//     if (isNaN(channel_id) || channel_id <= 0) {
//       throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
//     }

//     // Vérifier l'existence du type de modèle
//     const templateTypeExists = await this.prisma.templateType.findUnique({
//       where: { id: template_type_id },
//     });

//     if (!templateTypeExists) {
//       throw new NotFoundException(`Le type de modèle avec l'ID ${template_type_id} n'existe pas.`);
//     }

//     // Vérifier l'existence du canal
//     const channelExists = await this.prisma.channel.findUnique({
//       where: { id: channel_id },
//     });

//     if (!channelExists) {
//       throw new NotFoundException(`Le canal avec l'ID ${channel_id} n'existe pas.`);
//     }

//     // Vérifier la duplication du modèle
//     const existingTemplate = await this.prisma.template.findFirst({
//       where: {
//         content: createTemplateDto.content,
//         template_type_id: createTemplateDto.template_type_id,
//         deleted: false,  // S'assurer que ce n'est pas un modèle supprimé
//       },
//     });

//     if (existingTemplate) {
//       throw new ConflictException('Un modèle avec les mêmes détails existe déjà.');
//     }

//     // Création du modèle
//     return this.prisma.template.create({
//       data: {
//         name: createTemplateDto.name,
//         content: createTemplateDto.content,
//         template_type_id,
//       },
//     });
//   }

//   // Récupérer tous les Templates
//   async findAll() {
//     try {
//       return await this.prisma.template.findMany({
//         where: { deleted: false },  // Ne retourner que les modèles non supprimés
//         include: {
//           templateType: true,
//         },
//       });
//     } catch (error) {
//       throw new BadRequestException('Erreur lors de la récupération des modèles.');
//     }
//   }

//   // Récupérer un Template par ID
//   async findOne(id: number) {
//     if (isNaN(id) || id <= 0) {
//       throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
//     }

//     const template = await this.prisma.template.findUnique({
//       where: { id },
//       include: {
//         templateType: true,
//       },
//     });

//     if (!template || template.deleted) {
//       throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
//     }

//     return template;
//   }

//   // Mettre à jour un Template
//   async update(id: number, updateTemplateDto: UpdateTemplateDto) {
//     if (isNaN(id) || id <= 0) {
//       throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
//     }

//     const template = await this.prisma.template.findUnique({
//       where: { id },
//     });

//     if (!template) {
//       throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id}.`);
//     }

//     if (template.deleted) {
//       throw new BadRequestException('Ce modèle a été supprimé et ne peut pas être mis à jour.');
//     }

//     // Valider le type de modèle et le canal si fournis
//     if (updateTemplateDto.template_type_id && (isNaN(updateTemplateDto.template_type_id) || updateTemplateDto.template_type_id <= 0)) {
//       throw new BadRequestException('L\'ID du type de modèle doit être un nombre valide supérieur à zéro.');
//     }
//     if (updateTemplateDto.channel_id && (isNaN(updateTemplateDto.channel_id) || updateTemplateDto.channel_id <= 0)) {
//       throw new BadRequestException('L\'ID du canal doit être un nombre valide supérieur à zéro.');
//     }

//     return this.prisma.template.update({
//       where: { id },
//       data: updateTemplateDto,
//     });
//   }

//   // Supprimer un Template
//   async remove(id: number) {
//     if (isNaN(id) || id <= 0) {
//       throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
//     }

//     const template = await this.prisma.template.findUnique({
//       where: { id },
//     });

//     if (!template || template.deleted) {
//       throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${id} ou il est déjà supprimé.`);
//     }

//     return this.prisma.template.update({
//       where: { id },
//       data: { deleted: true },
//     });
//   }

//   // Appliquer un template à une campagne
//   async applyTemplateToCampaign(templateId: number, campaignId: number) {
//     if (isNaN(templateId) || templateId <= 0) {
//       throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
//     }

//     if (isNaN(campaignId) || campaignId <= 0) {
//       throw new BadRequestException('L\'ID de la campagne doit être un nombre valide supérieur à zéro.');
//     }

//     const template = await this.prisma.template.findUnique({
//       where: { id: templateId },
//     });

//     if (!template || template.deleted) {
//       throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId} ou il a été supprimé.`);
//     }

//     // Logique d'application du modèle à la campagne
//     return `Le modèle avec l'ID ${templateId} a été appliqué à la campagne avec l'ID ${campaignId}.`;
//   }

//   // Prévisualiser un template
//   async previewTemplate(templateId: number) {
//     if (isNaN(templateId) || templateId <= 0) {
//       throw new BadRequestException('L\'ID du modèle doit être un nombre valide supérieur à zéro.');
//     }

//     const template = await this.prisma.template.findUnique({
//       where: { id: templateId },
//     });

//     if (!template || template.deleted) {
//       throw new NotFoundException(`Aucun modèle trouvé avec l'ID ${templateId} ou il a été supprimé.`);
//     }

//     return {
//       id: template.id,
//       name: template.name,
//       content: template.content,
//       template_type_id: template.template_type_id,
//     };
//   }
// }
