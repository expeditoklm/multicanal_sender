import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    // constructor (private readonly nodemailer: Nodemailer) {}

    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transporter = nodemailer.createTransport({
            host     : 'localhost',
            port     : 1025,
            ignoreTLS: true,
            auth     : {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        return transporter
    }


    async   sendSignupConfirmation ( email : string) {
        (await this.transporter()).sendMail({
            from    : 'app@localhost.com',
            to      : email,
            subject : 'INSCRIPTION',
            html : '<h1>Signup Confirmation</h1>'
        });
    }


    async sendResetPassword ( email : string , url : string, code : string) { 
        (await this.transporter()).sendMail({
        
                from: 'app@localhost.com',
                to: email,
                subject: 'RÉINITIALISATION DU MOT DE PASSE',
                html: `
                  <h1>Réinitialisation du mot de passe</h1>
                  <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
                  <a href="${url}">Cliquez ici pour changer votre mot de passe</a>
                  <p>CODE : ${code}</p>
                  <p>Le code expire dans 15 minutes</p>
                `
        });
    }



}
