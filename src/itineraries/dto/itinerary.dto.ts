import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsMongoId, IsNotEmpty, Min } from "class-validator";

export class ItineraryDto {
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @Type(() => String)
  readonly user: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  readonly property: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  readonly bed_groups: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  readonly checkin: Date;

  @ApiProperty()
  @IsDateString({ strict: true })
  readonly checkout: Date;

  @ApiProperty()
  @Min(1)
  readonly num_adults: number;

  @ApiProperty()
  @Min(0)
  readonly num_children: number;

  @ApiProperty()
  readonly special_request: string;

  constructor(partial: Partial<ItineraryDto>) {
    Object.assign(this, partial);
  }
}