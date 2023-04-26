import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class LocationCoordsDto {
  @Transform(({ value }) => value?.toString())
  @Exclude()
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly longitude: number;
}