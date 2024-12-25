import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserCompanyDto } from './dto/createUserCompany.dto';
import { UpdateUserCompanyDto } from './dto/updateUserCompany.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('company')
  @ApiOperation({ summary: 'Associate user with company' })
  @ApiBody({ type: CreateUserCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'User-company association created successfully.',
  })
  async createUserCompany(@Body() createUserCompanyDto: CreateUserCompanyDto) {
    return this.userService.createUserCompany(createUserCompanyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('company/:userId/:companyId')
  @ApiOperation({ summary: 'Update user-company association' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiBody({ type: UpdateUserCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'User-company association updated successfully.',
  })
  async updateUserCompany(
    @Param('userId') userId: number,
    @Param('companyId') companyId: number,
    @Body() updateUserCompanyDto: UpdateUserCompanyDto,
  ) {
    return this.userService.updateUserCompany(
      +userId,
      +companyId,
      updateUserCompanyDto,
    );
  }
}
