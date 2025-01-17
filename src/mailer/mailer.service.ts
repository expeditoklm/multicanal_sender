import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Processor('mailQueue')
@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectQueue('mailQueue') private readonly mailQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
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

    // Fonction pour envoyer un email avec ou sans template
    private async sendEmail(to: string, subject: string, context: any, template?: string) {
        let mailContent;

        if (template) {
            // Si un template est fourni, compilez-le avec le contexte
            mailContent = this.compileTemplate(template, context);
        } else {
            // Générer un HTML brut qui intègre les variables du contexte
            mailContent = `
                <html>
                    <body>
                        <h1>${context.messageObject}</h1>
                        <p>Bonjour ${context.name} (${context.username}),</p>
                        <p>${context.messageContent}</p>

                        <h2>Campagne</h2>
                        <p><strong>Nom de la campagne :</strong> ${context.campaignName}</p>
                        <p><strong>Date de début :</strong> ${context.campaignStartDate}</p>
                        <p><strong>Date de fin :</strong> ${context.campaignEndDate}</p>

                        <h3>Détails supplémentaires de la campagne</h3>
                        <p><strong>Titre :</strong> ${context.templateCampaignTitle}</p>
                        <p><strong>Description :</strong> ${context.templateCampaignDesc}</p>
                        ${context.templateCampaignLink ? `<p><a href="${context.templateCampaignLink}">Plus d'infos</a></p>` : ''}
                        ${context.templateCampaignBtnText ? `<p><a href="${context.templateCampaignBtnLink}">${context.templateCampaignBtnText}</a></p>` : ''}
                        ${context.templateCampaignImg ? `<img src="${context.templateCampaignImg}" alt="Image de campagne"/>` : ''}

                        <h2>Informations sur l'entreprise</h2>
                        <p><strong>Nom :</strong> ${context.companyName}</p>
                        <p><strong>Description :</strong> ${context.companyDesc}</p>
                        <p><strong>Localisation :</strong> ${context.companyLocation}</p>
                        <p><strong>Téléphone :</strong> ${context.companyPhone}</p>
                        <p><strong>Whatsapp :</strong> ${context.companyWhatsapp}</p>

                        <h3>Suivez-nous sur :</h3>
                        <p>${context.companyLinkFb ? `<a href="${context.companyLinkFb}">Facebook</a>` : ''}</p>
                        <p>${context.companyLinkInsta ? `<a href="${context.companyLinkInsta}">Instagram</a>` : ''}</p>
                        <p>${context.companyLinkTiktok ? `<a href="${context.companyLinkTiktok}">TikTok</a>` : ''}</p>
                        <p>${context.companyLinkTwit ? `<a href="${context.companyLinkTwit}">Twitter</a>` : ''}</p>
                        <p>${context.companyYoutube ? `<a href="${context.companyYoutube}">YouTube</a>` : ''}</p>
                        <p>${context.companyPinterest ? `<a href="${context.companyPinterest}">Pinterest</a>` : ''}</p>

                        <p><strong>Visitez notre site :</strong> <a href="${context.CompanyLink}">${context.CompanyLink}</a></p>
                    </body>
                </html>
            `;
        }

        const mailOptions = {
            from: 'app@localhost.com',
            to,
            subject,
            html: mailContent, // On envoie toujours du HTML ici (même si c'est sans style)
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
        let _1messageContact;
        console.log("je suis dans le process",_1contact.id)

        try {
            // Récupérer le message avec la campagne associée
            const completeMessage = await this.prisma.message.findUnique({
                where: { id: message.id },
                include: {
                    campaign: true,  // Inclusion de la campagne
                },
            });

            if (!completeMessage?.campaign) {
                console.error(`La campagne associée au message ID ${message.id} est introuvable.`);
                throw new Error(`La campagne associée au message ID ${message.id} est introuvable.`);
            }

            // Récupérer le template personnalisé du message
            const PersonalizedTemplate = await this.prisma.templateMessage.findFirst({
                where: { message_id: message.id },
                include: {
                    template: true,
                },
            });

            // Récupérer l'entreprise via la campagne associée au message
            const company = await this.prisma.company.findFirst({
                where: { id: completeMessage.campaign.company_id },
            });

            const year = new Date().getFullYear();
            const baseUrl = this.configService.get<string>('BASE_URL');
            // Vérification des valeurs optionnelles pour éviter des erreurs nulles
            const context = {
                name: _1contact.name,
                username: _1contact.username,
                messageContent: completeMessage.content,
                messageObject: completeMessage.object,
                campaignName: completeMessage.campaign.name,
                campaignStartDate: completeMessage.campaign.start_date,
                campaignEndDate: completeMessage.campaign.end_date,
                templateCampaignTitle: PersonalizedTemplate?.title || '<<Non défini>>',
                templateCampaignDesc: PersonalizedTemplate?.description || '<<Non défini>>',
                templateCampaignLink: PersonalizedTemplate?.link || '<<Non défini>>',
                templateCampaignBtnText: PersonalizedTemplate?.btn_txt || '<<Non défini>>',
                templateCampaignBtnLink: PersonalizedTemplate?.btn_link || '<<Non défini>>',
                templateCampaignImg: PersonalizedTemplate?.image || '<<Non défini>>',
                companyName: company?.name || '<<Non défini>>',
                companyDesc: company?.description || 'Description non définie',
                companyLinkFb: company?.link_fb || '',
                companyLinkTiktok: company?.link_tiktok || '',
                companyLinkInsta: company?.link_insta || '',
                companyLinkTwit: company?.link_twit || '',
                companyYoutube: company?.link_youtube || '',
                companyPinterest: company?.link_pinterest || '',
                CompanyLink: company?.link || '',
                companySecondaryColor: company?.secondary_color || '',
                companyPrimaryColor: company?.primary_color || '',
                companyTertiaryColor: company?.tertiary_color || '',
                companyPhone: company?.phone || '',
                companyWhatsapp: company?.whatsapp || '',
                companyLocation: company?.location || '',
                year : year,
                baseUrl : baseUrl,
            };

            // Créer l'entrée dans `messageContact` pour chaque contact
            _1messageContact = await this.prisma.messageContact.create({
                data: {
                    message_id: completeMessage.id,
                    contact_id: _1contact.id, // Utilisation du `id` du contact
                    hasRecevedMsg: true,
                    interact_date: new Date(),
                    interact_type_id: 1,
                    deleted: false,
                },
            });
                // si useTemplate est false utiliser PersonalizedTemplate?.template.name
            await this.sendEmail(
                _1contact.email, 
                completeMessage.object,
                context,
                PersonalizedTemplate.useTemplate ? PersonalizedTemplate?.template.name : undefined
            );


            if (_1messageContact) {
                // supprimer les entrées `messageContact` qui ont reuissi
                await this.prisma.messageContact.delete({
                    where: { id: _1messageContact.id, hasRecevedMsg: true },
                });
            }
            // supprimer le contact de audienceContact

            await this.prisma.audienceContact.delete({
                where: {
                    audience_id_contact_id: {
                        contact_id: _1contact.id,
                        audience_id: completeMessage.audience_id
                    }
                }
            });

            // supprimer le contact si lenvoie est reuissi et si non associé a d'autre audience
            await this.prisma.contact.delete({
                where: { id: _1contact.id },
            });

        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email à: ${_1contact.email}`, error);
            if (_1messageContact) {
                // Mettre à jour l'entrée `messageContact` en cas d'erreur
                await this.prisma.messageContact.update({
                    where: { id: _1messageContact.id },
                    data: {
                        hasRecevedMsg: false,
                        updated_at: new Date(),
                    },
                });
            } else {
                // Si `_1messageContact` n'existe pas, créer une entrée pour l'erreur
                await this.prisma.messageContact.create({
                    data: {
                        message_id: message.id,
                        contact_id: _1contact.id,
                        hasRecevedMsg: false,
                        interact_date: new Date(),
                        interact_type_id: 1,
                        deleted: false,
                        updated_at: new Date(),
                    },
                });
            }
        }
    }


}
