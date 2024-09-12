import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MessagenpxModule } from './messagenpx/messagenpx.module';

@Global()
@Module({
  controllers: [],
  providers: [PrismaService],
  exports : [PrismaService],
  imports: [MessagenpxModule]
})
export class PrismaModule {}
   