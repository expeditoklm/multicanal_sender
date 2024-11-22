// dto/create-user.dto.ts
import { IsString, IsEmail,  IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'USER' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string = 'defaultPassword123'; // Valeur par défaut
}


