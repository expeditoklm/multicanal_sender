// src/controllers/user-company.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { FindUsersByCompanyDto } from './dto/findUsersByCompanyDto';
import { RemoveUserFromCompanyDto } from './dto/removeUserFromCompanyDto';
import { GetCompanyByUserDto } from './dto/getCompanyByUserDto';

import { UpdateUserCompanyDto } from './dto/updateUserCompanyDto';
import { AssociateUserToCompaniesDto } from './dto/associateUserToCompaniesDto';


@Controller('user-company')
export class UserCompanyController {
    constructor(private readonly userCompanyService: UserCompanyService) { }

    @Post('find-users')
    async findUsersByCompany(@Body() dto: FindUsersByCompanyDto) {
        return this.userCompanyService.findUsersByCompany(dto);
    }

    @Post('remove-user')
    async removeUserFromCompany(@Body() dto: RemoveUserFromCompanyDto) {
        return this.userCompanyService.removeUserFromCompany(dto);
    }

    @Get('company/:userId')
    async getCompanyByUser(@Param('userId') userId: number) {
        return this.userCompanyService.getCompanyByUser({ userId });
    }



    @Post('associate')
    async associateUserToCompanies(@Body() dto: AssociateUserToCompaniesDto) {
      return this.userCompanyService.associateUserToCompanies(dto);
    }
  
    @Post('update-company')
    async updateUserCompany(@Body() dto: UpdateUserCompanyDto) {
      return this.userCompanyService.updateUserCompany(dto);
    }
}
