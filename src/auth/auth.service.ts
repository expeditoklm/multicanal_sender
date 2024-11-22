import { BadRequestException, Body, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';

import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { SignInDto } from './dto/singnin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { ActivateUserInCompanyDto } from './dto/activateUserInCompany.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService

    ) { }

    async signUp(signUpDto: SignUpDto) {
        const { password, email, username, name } = signUpDto;
        const user = await this.prismaService.user.findFirst({
            where: { email }
        });
        if (user) {
            throw new ConflictException('User already exists');
        }
        if (!password) {
            throw new Error("Password is required");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await this.prismaService.user.create({
            data: {
                name,
                username,
                email,
                password: hashPassword,
                role: signUpDto.role ?? 'user',
                deleted: signUpDto.deleted ?? false,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        await this.emailService.sendSignupConfirmation(email);

        return { data: 'User created successfully' };
    }


    async signIn(signInDto: SignInDto) {

        const { email, password } = signInDto;
        const user = await this.prismaService.user.findFirst({ where: { email: signInDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = this.jwtService.sign(payload, { expiresIn: '2h', secret: this.configService.get('SECRET_KEY') });
        return {
            token: token,
            user: {
                name: user.name,
                userName: user.username,
                email: user.email,
            },
            data: 'User signed in successfully'
        }
    }



    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        const { email } = resetPasswordDemandDto;
        const user = await this.prismaService.user.findFirst({ where: { email: resetPasswordDemandDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        });
        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.emailService.sendResetPassword(email, url, code); //await this.emailService.resetPassword(email, url, speakeasy.totp({ secret : this.configService.get('OTP_CODE') , encoding : 'base32' }));
        return {
            data: "Reset password mail has been sent"
        }
    }


    async resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const { email, password, code } = resetPasswordConfirmationDto;
        const user = await this.prismaService.user.findFirst({ where: { email: resetPasswordConfirmationDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const isMatch = await speakeasy.totp.verify({
            secret: this.configService.get('OTP_CODE'),
            token: code,
            encoding: 'base32',
            step: 60 * 15,
            digits: 5,
        });
        if (!isMatch) throw new UnauthorizedException('Invalid code');
        const hashPassword = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({ where: { email: email }, data: { password: hashPassword } })

        return { data: "Password Updated" }
    }


    async activateUser(@Body() activateUserInCompanyDto: ActivateUserInCompanyDto,userId : number) {

        const user = await this.prismaService.user.findFirst({ where: { id: activateUserInCompanyDto.user_id } });
        if (!user) throw new ConflictException('User does not exist');


        const company = await this.prismaService.company.findFirst({ where: { id: activateUserInCompanyDto.company_id} });
        if (!company) throw new ConflictException('Company does not exist');

        const _userCompany = await this.prismaService.userCompany.findFirst({
             where: { 
                company_id: activateUserInCompanyDto.company_id,
                user_id: activateUserInCompanyDto.user_id
            
        }});

        if (!_userCompany) throw new BadRequestException('Cette action ne peut etre possible ');

        const userConnectedIsIncompany = await this.prismaService.userCompany.findFirst({ where: {
             user_id: userId,
             company_id: activateUserInCompanyDto.company_id,
             isMember : true
            } });
        if (!userConnectedIsIncompany) throw new ConflictException('Cette action ne peut etre possible par vous');


        const userActivated = await this.prismaService.userCompany.update({ 
            where: { id: _userCompany.id},
        data : { isMember: true} });

        
       return {
            user: {
                userName: user.username,
                name: user.name,
            },
            data: 'User activated  successfully'
        }
    }



}
