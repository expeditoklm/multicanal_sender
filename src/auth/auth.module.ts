import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports : [JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtModule,AuthService]
})
export class AuthModule {}
