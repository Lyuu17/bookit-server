import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  readonly country_code: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly region: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly postal_code: string;
}