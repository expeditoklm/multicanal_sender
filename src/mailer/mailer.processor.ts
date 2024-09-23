import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('mailQueue')
export class MailerProcessor {
  @Process('send-mail')
  async handleSendMail(job: Job) {
    const { _1contact, message } = job.data;
    console.log(`Préparation de l'envoi de l'email à: ${_1contact.email}`);
    try {
      const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
      });
      const mailOptions = {
        from: 'app@localhost.com',
        to: _1contact.email,
        subject: message.subject,
        text: message.content,
      };
      await transporter.sendMail(mailOptions);
      console.log(`Email envoyé avec succès à: ${_1contact.email}`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email à: ${_1contact.email}`, error);
    }
  }
}
