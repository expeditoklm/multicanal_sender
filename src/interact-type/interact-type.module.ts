import { Module } from '@nestjs/common';
import { InteractTypeController } from './interact-type.controller';
import { InteractTypeService } from './interact-type.service';

@Module({
  controllers: [InteractTypeController],
  providers: [InteractTypeService]
})
export class InteractTypeModule {}
