import { IsNotEmpty, IsPhoneNumber, ValidateNested } from "class-validator";
import { Exclude, Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AddressDto } from "./address.dto";
import { AmenityDto } from "./amenity.dto";
import { CheckinDto } from "./checkin.dto";
import { LocationCoordsDto } from "./locationcoords.dto";
import { RoomDto } from "./room.dto";

export class PropertyDto {
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  readonly address: AddressDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LocationCoordsDto)
  readonly location_coords: LocationCoordsDto;

  @ApiProperty()
  @IsPhoneNumber()
  readonly phone: string;

  @Exclude()
  @Type(() => CreateUserDto)
  readonly adminUsers?: [CreateUserDto];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckinDto)
  readonly checkin: CheckinDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => AmenityDto)
  readonly amenities: AmenityDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  readonly rooms: RoomDto[];

  constructor(partial: Partial<PropertyDto>) {
    Object.assign(this, partial);
  }
}