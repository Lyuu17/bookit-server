import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateLocationCoordsDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly longitude: number;
}