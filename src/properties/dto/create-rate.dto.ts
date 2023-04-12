import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { CreateAmenityDto } from "./create-amenity.dto";
import { CreateBedgroupDto } from "./create-bedgroup.dto";

export class CreateRateDto {
  @IsIn(["available", "unavailable"])
  readonly status: string;

  @Min(0)
  readonly available_rooms: number;

  @IsNotEmpty()
  readonly refundable: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateAmenityDto)
  readonly amenities: CreateAmenityDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBedgroupDto)
  readonly bed_groups: CreateBedgroupDto[];
}