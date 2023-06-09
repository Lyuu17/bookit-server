import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  @MaxLength(10)
  readonly birthdate: string;
}