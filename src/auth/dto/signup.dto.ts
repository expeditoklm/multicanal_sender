import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

// La classe DTO devrait inclure tous les attributs nécessaires pour la validation
export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsOptional()  // Si 'role' est facultatif lors de l'inscription
    @IsString()
    readonly role?: string;
 
    @IsOptional()  // Si 'deleted' est facultatif lors de l'inscription
    @IsBoolean()
    readonly deleted?: boolean;

    @IsOptional()  // Si 'created_at' est facultatif lors de l'inscription
    @IsString()  // Utiliser le format de chaîne pour DateTime si nécessaire
    readonly created_at?: string;

    @IsOptional()  // Si 'updated_at' est facultatif lors de l'inscription
    @IsString()  // Utiliser le format de chaîne pour DateTime si nécessaire
    readonly updated_at?: string;
}
