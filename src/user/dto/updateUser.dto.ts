import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./createUser.dto";
import { IsEmail, IsOptional, IsString } from "class-validator";

// dto/update-user-company.dto.ts
export class UpdateUserDto {
    
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
      
      
}













