import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Param, Put, Delete, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AudienceService } from './audience.service';
import { CreateAudienceDto } from './dto/createAudience.dto';
import { UpdateAudienceDto } from './dto/updateAudience.dto';
import { AddContactToAudienceDto } from './dto/addContactToAudience.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiConsumes, ApiResponse } from '@nestjs/swagger';


import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@ApiTags('Audience') // Groupe de routes pour Swagger
@Controller('audiences')
export class AudienceController {
  constructor(private readonly audienceService: AudienceService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle audience' }) // Décrit l'opération
  @ApiBody({ description: 'Données pour créer une audience', type: CreateAudienceDto }) // Décrit le corps de la requête
  create(@Body() createAudienceDto: CreateAudienceDto, @Req() request: Request) {
    const userId = request.user['id'];
    return this.audienceService.create(createAudienceDto, userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les audiences' }) // Décrit l'opération
  findAll() {
    return this.audienceService.findAll();
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findOne(@Param('id') id: string) {
    return this.audienceService.findOne(+id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience à mettre à jour', type: String }) // Paramètre id
  @ApiBody({ description: 'Données pour mettre à jour l’audience', type: UpdateAudienceDto }) // Décrit le corps de la requête
  update(@Param('id') id: string, @Body() updateAudienceDto: UpdateAudienceDto) {
    return this.audienceService.update(+id, updateAudienceDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une audience par son ID' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience à supprimer', type: String }) // Paramètre id
  remove(@Param('id') id: string) {
    return this.audienceService.remove(parseInt(id));
  }



  @UseGuards(AuthGuard('jwt'))
  @Get(':audienceId/messages')
  @ApiOperation({ summary: 'Obtenir tous les messages d’une audience spécifique' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findMessagesByAudience(@Param('audienceId') audienceId: string) {
    return this.audienceService.findMessagesByAudience(+audienceId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':audienceId/contacts')
  @ApiOperation({ summary: 'Obtenir tous les contacts d’une audience spécifique' }) // Décrit l'opération
  @ApiParam({ name: 'audienceId', description: 'L’ID de l’audience', type: String }) // Paramètre audienceId
  findContactsByAudience(@Param('audienceId') audienceId: string) {
    return this.audienceService.findContactsByAudience(+audienceId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('add-contact')
  @ApiOperation({ summary: 'Ajouter un contact à une audience' }) // Décrit l'opération
  @ApiBody({ description: 'Données pour ajouter un contact à l’audience', type: AddContactToAudienceDto }) // Décrit le corps de la requête
  addContactToAudience(@Body() dto: AddContactToAudienceDto) {
    return this.audienceService.addContactToAudience(dto.contactId, dto.audienceId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post(':id/contacts')
  @ApiOperation({ summary: 'Associer un tableau de contacts à une audience' }) // Décrit l'opération
  @ApiParam({ name: 'id', description: 'L’ID de l’audience', type: String }) // Paramètre id
  @ApiBody({ description: 'Tableau de contacts à associer', type: [Object] }) // Décrit le corps de la requête
  async associateContacts(
    @Param('id') audienceId: string,
    @Body() contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[]
  ) {
    return this.audienceService.associateContacts(parseInt(audienceId), contacts);
  }





  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload a file and associate contacts to an audience' }) // Documentation pour la route
  @ApiParam({ name: 'audienceId', type: 'number', description: 'ID of the audience to associate contacts with' }) // Documentation du paramètre `audienceId`
  @ApiConsumes('multipart/form-data') // Indique que la route consomme des fichiers via multipart
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }) // Décrit le body de la requête (ici un fichier)
  @ApiResponse({ status: 200, description: 'Contacts successfully associated with the audience' }) // Réponse de succès
  @ApiResponse({ status: 404, description: 'Audience not found' }) // Réponse d'erreur


  @UseGuards(AuthGuard('jwt'))
  @Post(':audienceId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContacts(@Param('audienceId') audienceId: number, @UploadedFile() file: Express.Multer.File) {
    // Assurez-vous que la clé 'file' est bien utilisée dans le fichier envoyé depuis Postman
    try {
      const contacts = await this.parseFile(file);
      console.log(contacts);
      return this.audienceService.associateContacts(audienceId, contacts);
    } catch (error) {
      throw new HttpException(
        'Error occurred while uploading contacts. Please check the file format.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }




  async parseFile(file: Express.Multer.File) {
    const contacts: { email: string; name: string; phone?: string; username?: string; source?: string }[] = [];

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Gérer le fichier Excel
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Lire les données en considérant la première ligne comme entête
      const jsonData: (string | number)[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      const headers: string[] = jsonData[0] as string[]; // Cast de la première ligne en tableau de chaînes
      const dataRows = jsonData.slice(1); // Récupérer les lignes de données

      // Normaliser les données
      const normalizedData = dataRows.map((row: (string | number)[]) => {
        return {
          email: row[headers.indexOf('email')]?.toString().trim(),
          name: row[headers.indexOf('name')]?.toString().trim(),
          phone: row[headers.indexOf('phone')]?.toString(),
          username: row[headers.indexOf('username')]?.toString().trim(),
          source: row[headers.indexOf('source')]?.toString().trim(),
        };
      });
      contacts.push(...normalizedData);

    } else if (file.mimetype === 'text/csv') {
      // Gérer le fichier CSV avec un point-virgule comme séparateur
      const csv = file.buffer.toString('utf-8'); // Convertit le fichier en chaîne de caractères
      const rows = csv.split('\n');
      const headers = rows[0].split(';'); // Utilisez le point-virgule comme séparateur

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(';'); // Utilisez le point-virgule comme séparateur
        let contact: any = {};
        headers.forEach((header, index) => {
          contact[header.trim()] = values[index]?.trim();
        });
        contacts.push(contact);
      }
    } else {
      throw new Error('Unsupported file format');
    }

    return contacts;
  }











}
