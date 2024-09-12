import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  // Configurez les pipes de validation globalement
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Jette une erreur si des propriétés non définies sont trouvées
    transform: true, // Transforme les objets en types attendus par le DTO
  }));

  await app.listen(3000);
}
bootstrap();
