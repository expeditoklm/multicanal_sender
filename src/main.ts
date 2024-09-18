import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Démarrage de l'application sur le port 3000
  await app.listen(3000);
}

bootstrap();
