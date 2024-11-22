import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class ActivateUserInCompanyDto {

  @IsNotEmpty()
  @IsInt({ message: 'L\'identifiant de l\'entreprise doit être un entier.' })
  company_id: number;

  @IsNotEmpty()
  @IsInt({ message: 'L\'identifiant de l\'utilisateur doit être un entier.' })
  user_id: number;
}