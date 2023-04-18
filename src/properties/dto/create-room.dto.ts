import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRateDto } from "./create-rate.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CreateBedgroupDto } from "./create-bedgroup.dto";
import { CreateAmenityDto } from "./create-amenity.dto";

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateAmenityDto)
  readonly amenities: CreateAmenityDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBedgroupDto)
  readonly bed_groups: CreateBedgroupDto[];

  /*
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRateDto)
  readonly rates: CreateRateDto[];
  */
}