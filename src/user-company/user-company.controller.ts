import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { FindUsersByCompanyDto } from './dto/findUsersByCompany.dto';
import { RemoveUserFromCompanyDto } from './dto/removeUserFromCompany.dto';
import { GetCompanyByUserDto } from './dto/getCompanyByUser.dto';
import { UpdateUserCompanyDto } from './dto/updateUserCompany.dto';
import { AssociateUserToCompaniesDto } from './dto/associateUserToCompanies.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User-Company') // Catégorie Swagger pour les relations utilisateur-entreprise
@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('find-users')
  @ApiOperation({ summary: 'Trouver les utilisateurs par entreprise' })
  @ApiBody({ description: 'Données pour trouver les utilisateurs par entreprise', type: FindUsersByCompanyDto })
  @ApiResponse({ status: 200, description: 'Utilisateurs trouvés avec succès.' })
  async findUsersByCompany(@Body() dto: FindUsersByCompanyDto) {
    return this.userCompanyService.findUsersByCompany(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove-user')
  @ApiOperation({ summary: 'Retirer un utilisateur d’une entreprise' })
  @ApiBody({ description: 'Données pour retirer un utilisateur d’une entreprise', type: RemoveUserFromCompanyDto })
  @ApiResponse({ status: 200, description: 'Utilisateur retiré avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur ou entreprise non trouvés.' })
  async removeUserFromCompany(@Body() dto: RemoveUserFromCompanyDto) {
    return this.userCompanyService.removeUserFromCompany(dto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('company/:userId')
  @ApiOperation({ summary: 'Obtenir l’entreprise d’un utilisateur par ID' })
  @ApiParam({ name: 'userId', description: 'ID de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Entreprise trouvée.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  async getCompanyByUser(@Param('userId') userId: number) {
    return this.userCompanyService.getCompanyByUser({ userId });
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('associate')
  @ApiOperation({ summary: 'Associer un utilisateur à des entreprises' })
  @ApiBody({ description: 'Données pour associer un utilisateur à des entreprises', type: AssociateUserToCompaniesDto })
  @ApiResponse({ status: 200, description: 'Utilisateur associé aux entreprises avec succès.' })
  async associateUserToCompanies(@Body() dto: AssociateUserToCompaniesDto) {
    return this.userCompanyService.associateUserToCompanies(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-company')
  @ApiOperation({ summary: 'Mettre à jour les informations d’une entreprise pour un utilisateur' })
  @ApiBody({ description: 'Données pour mettre à jour les informations d’une entreprise', type: UpdateUserCompanyDto })
  @ApiResponse({ status: 200, description: 'Informations d’entreprise mises à jour avec succès.' })
  async updateUserCompany(@Body() dto: UpdateUserCompanyDto) {
    return this.userCompanyService.updateUserCompany(dto);
  }
}
