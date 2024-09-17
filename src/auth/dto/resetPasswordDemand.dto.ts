import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDemandDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}