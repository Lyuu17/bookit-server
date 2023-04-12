import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRoomDto } from "./create-room.dto";
import { Type } from "class-transformer";

export class CreatePropertyDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  readonly rooms: CreateRoomDto[];
}