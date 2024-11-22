import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/singnin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ActivateUserInCompanyDto } from './dto/activateUserInCompany.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentification') // Groupe de routes sous le tag 'Authentification'
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Inscription d’un utilisateur' }) // Décrit l’opération d'inscription
    @ApiBody({ description: 'Données pour l’inscription', type: SignUpDto }) // Décrit le corps de la requête pour l'inscription
    signUp(@Body() signUpDto: SignUpDto) {
        console.log(signUpDto);
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    @ApiOperation({ summary: 'Connexion d’un utilisateur' }) // Décrit l’opération de connexion
    @ApiBody({ description: 'Données pour la connexion', type: SignInDto }) // Décrit le corps de la requête pour la connexion
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' }) // Décrit l’opération de demande de réinitialisation
    @ApiBody({ description: 'Données pour demander la réinitialisation de mot de passe', type: ResetPasswordDemandDto }) // Décrit le corps de la requête pour la demande de réinitialisation
    resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto);
    }

    @Post('reset-password-confirmation')
    @ApiOperation({ summary: 'Confirmation de la réinitialisation du mot de passe' }) // Décrit l’opération de confirmation de réinitialisation
    @ApiBody({ description: 'Données pour confirmer la réinitialisation du mot de passe', type: ResetPasswordConfirmationDto }) // Décrit le corps de la requête pour la confirmation de réinitialisation
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('activate-user')
    @ApiOperation({ summary: 'Connexion d’un utilisateur' }) // Décrit l’opération de connexion
    @ApiBody({ description: 'Données pour la connexion', type: ActivateUserInCompanyDto }) // Décrit le corps de la requête pour la connexion
    activateUser(@Body() activateUserInCompanyDto: ActivateUserInCompanyDto,@Req() request : Request) {
        const userId =  request.user['id'];
        return this.authService.activateUser(activateUserInCompanyDto,userId);
    }

}
