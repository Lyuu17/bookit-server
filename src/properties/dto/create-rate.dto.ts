import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { CreateAmenityDto } from "./create-amenity.dto";
import { CreateBedgroupDto } from "./create-bedgroup.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRateDto {
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
  @Type(() => CreateAmenityDto)
  readonly amenities: CreateAmenityDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBedgroupDto)
  readonly bed_groups: CreateBedgroupDto[];
}