import { Module } from '@nestjs/common';
import { TemplateTypeController } from './template-type.controller';
import { TemplateTypeService } from './template-type.service';

@Module({
  controllers: [TemplateTypeController],
  providers: [TemplateTypeService]
})
export class TemplateTypeModule {}
