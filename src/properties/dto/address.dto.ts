import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AddressDto {
  @Exclude()
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly street: string;

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