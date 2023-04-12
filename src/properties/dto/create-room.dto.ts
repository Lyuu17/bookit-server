import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRateDto } from "./create-rate.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRateDto)
  readonly rates: CreateRateDto[];
}