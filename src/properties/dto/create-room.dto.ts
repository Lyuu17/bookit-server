import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRateDto } from "./create-rate.dto";

export class CreateRoomDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRateDto)
  readonly rates: CreateRateDto[];
}