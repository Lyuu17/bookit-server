import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsIn, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { AmenityDto } from "./amenity.dto";
import { BedgroupDto } from "./bedgroup.dto";

export class RateDto {
  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  @Expose({ name: 'id' })
  readonly _id?: string;

  @ApiProperty()
  @IsIn(["available", "unavailable"])
  readonly status: string;

  @ApiProperty()
  @Min(0)
  readonly available_rooms: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly refundable: boolean;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => AmenityDto)
  readonly amenities: AmenityDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BedgroupDto)
  readonly bed_groups: BedgroupDto[];
}