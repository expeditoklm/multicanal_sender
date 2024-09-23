import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('mailQueue')
@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectQueue('mailQueue') private readonly mailQueue: Queue,
        private readonly prisma: PrismaService,
    ) {
        this.initializeTransporter();
    }

    private async initializeTransporter() {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    // Fonction pour compiler les templates Handlebars
    private compileTemplate(templateName: string, context: any): string {
        const templatePath = path.resolve(`./src/message/templates/${templateName}.hbs`);
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);
        return template(context);
    }

    // Fonction pour envoyer un email
    private async sendEmail(to: string, subject: string, context: any, template: string) {
        const html = this.compileTemplate(template, context);
        const mailOptions = {
            from: 'app@localhost.com',
            to,
            subject,
            html,
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendSignupConfirmation(email: string) {
        await this.sendEmail(email, 'INSCRIPTION', {}, 'signup_confirmation');
    }

    async sendResetPassword(email: string, url: string, code: string) {
        const context = {
            url,
            code,
        };

        await this.sendEmail(email, 'RÉINITIALISATION DU MOT DE PASSE', context, 'reset_password');
    }

    async sendMail(_1contact: any, message: any) {
        try {
            const job = await this.mailQueue.add('send-mail', { _1contact, message });
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email à: ${_1contact.email}`, error);
        }
    }

    @Process('send-mail')
    async handleSendMail(job: Job) {
        const { _1contact, message } = job.data;
        try {
            const templateCampaign = await this.prisma.templateCampaign.findFirst({
                where: { message_id: message.id },
                include: {
                    campaign: true,
                    template: true,
                },
            });

                const company = await this.prisma.company.findFirst({
                    where: { id: templateCampaign.campaign.company_id },
                });
            
                // Traitez ici la variable `company` comme nécessaire
          
          

            const context = {
                name: _1contact.name,
                username: _1contact.username,
                messageContent: message.content,
                messageObject: message.object,
                campaignName: templateCampaign.campaign.name,
                campaignStartDate: templateCampaign.campaign.start_date,
                campaignEndDate: templateCampaign.campaign.end_date,
                templateCampaignTitle: templateCampaign.title,
                templateCampaignDesc: templateCampaign.description,
                templateCampaignLink: templateCampaign.link,
                templateCampaignBtnText: templateCampaign.btn_txt,
                templateCampaignBtnLink: templateCampaign.btn_link,
                templateCampaignImg: templateCampaign.image,
                companyName: company.name,
                companyDesc: company.description,
                companyLinkFb: company.link_fb,
                companyLinkTiktok: company.link_tiktok,
                companyLinkInsta: company.link_insta,
                companyLinkTwit: company.link_twit,
                companyYoutube: company.link_youtube,
                companyPinterest: company.link_pinterest,
                CompanyLink: company.link,
                companySecondColor: company.secondary_color,
                companyPrimaryColor: company.primary_color,
                companyTertiaryColor: company.tertiary_color,
                companyPhone: company.phone,
                companyWhatsapp: company.whatsapp,
                companyLocation: company.location,
              
            };

            console.log(message);
           // console.log(company);
            //console.log(company.link_fb);
           // console.log(company);

            await this.sendEmail(_1contact.email, message.subject, context, templateCampaign.template.name);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email à: ${_1contact.email}`, error);
        }
    }
}
