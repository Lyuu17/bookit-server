import { IsNotEmpty, IsPhoneNumber, ValidateNested } from "class-validator";
import { CreateRoomDto } from "./create-room.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreateAddressDto } from "./create-address.dto";
import { CreateLocationCoordsDto } from "./create-locationcoords.dto";

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  readonly address: CreateAddressDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateLocationCoordsDto)
  readonly location_coords: CreateLocationCoordsDto;

  @ApiProperty()
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  readonly rooms: CreateRoomDto[];
}