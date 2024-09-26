import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUrl } from 'class-validator';

export class CreateTemplateMessageDto {
    @ApiProperty({ description: 'ID du message associé' })
    @IsInt()
    message_id: number;

    @ApiProperty({ description: 'ID du template associé' })
    @IsInt()
    template_id: number;

    @ApiProperty({ description: 'Titre du message', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ description: 'Description du message', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Lien dans le message', required: false })
    @IsUrl()
    @IsOptional()
    link?: string;

    @ApiProperty({ description: 'Texte du bouton', required: false })
    @IsString()
    @IsOptional()
    btn_txt?: string;

    @ApiProperty({ description: 'Lien du bouton', required: false })
    @IsUrl()
    @IsOptional()
    btn_link?: string;

    @ApiProperty({ description: 'Image associée au message', required: false })
    @IsString()
    @IsOptional()
    image?: string;
}
