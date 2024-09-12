import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signupDto';
import { SignInDto } from './dto/singninDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService : AuthService) {}
    @Post('signup')
    signUp(@Body() signUpDto : SignUpDto) {
        console.log(signUpDto);
        return this.authService.signUp(signUpDto)
    }

    @Post('signin')
    signIn(@Body() signInDto : SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @Post('reset-password')
    resetPasswordDemand(@Body() resetPasswordDemandDto : ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }


    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }

}
