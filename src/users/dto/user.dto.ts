import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class UserDto {
  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  @Expose({ name: 'id' })
  readonly _id?: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @Exclude()
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

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}