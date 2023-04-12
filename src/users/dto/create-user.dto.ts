import { IsDate, IsDateString, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsDateString({ strict: true })
  readonly birthdate: string;
}