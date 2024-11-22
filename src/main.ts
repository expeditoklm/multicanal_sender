import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DateParserMiddleware } from './message/date.middleware';
import { json } from 'express';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  // Création de l'application NestJS avec des paramètres de journalisation
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  // Configuration de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MULTICANAL SENDER')
    .setDescription('API de gestion de campagnes de publicité multicanal')
    .setVersion('1.0')
    .addTag('NestJS')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // Configuration des pipes de validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Jette une erreur si des propriétés non définies sont trouvées
    transform: true, // Transforme les objets en types attendus par le DTO
  }));
  app.use(json()); // Ajoutez cette ligne
  app.use(new DateParserMiddleware().use);
  app.use('/images', express.static(path.join(__dirname, '../src/message/templates/images')));


  app.enableCors({
    origin: 'http://localhost:4200',  // Autoriser les requêtes de cette origine
    methods: 'GET,POST,PUT,DELETE',   // Méthodes HTTP autorisées
    allowedHeaders: 'Content-Type, Authorization',  // En-têtes autorisés
    credentials: true  // Si vous avez besoin d'envoyer des cookies
  });
  // Démarrage de l'application sur le port 3000
  await app.listen(3000);
}

bootstrap();
