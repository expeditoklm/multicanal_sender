import { IsString } from "class-validator";

// src/interactType/dto/create-interactType.dto.ts
export class CreateInteractTypeDto {
  @IsString()
    label: string;
  }
  