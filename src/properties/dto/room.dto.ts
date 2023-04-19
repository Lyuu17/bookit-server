import { Transform, Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AmenityDto } from "./amenity.dto";
import { BedgroupDto } from "./bedgroup.dto";

export class RoomDto {
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => AmenityDto)
  readonly amenities: AmenityDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BedgroupDto)
  readonly bed_groups: BedgroupDto[];

  /*
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRateDto)
  readonly rates: CreateRateDto[];
  */
}