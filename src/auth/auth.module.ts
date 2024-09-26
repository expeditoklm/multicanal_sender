import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),  // Définir la stratégie par défaut comme "jwt"
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),  // Récupérer la clé secrète depuis la configuration
        signOptions: { expiresIn: '60s' },        // Définir les options de signature JWT
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],  // Ajouter JwtStrategy dans les providers
})
export class AuthModule {}
