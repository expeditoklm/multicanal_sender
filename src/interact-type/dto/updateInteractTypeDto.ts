import { IsString, IsBoolean } from "class-validator";

// src/interactType/dto/update-interactType.dto.ts
export class UpdateInteractTypeDto {
    @IsString()

    label?: string;
    @IsBoolean()
    deleted?: boolean;
  }
  