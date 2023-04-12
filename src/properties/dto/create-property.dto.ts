import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRoomDto } from "./create-room.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  readonly rooms: CreateRoomDto[];
}