import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, Min } from "class-validator";

export class ItineraryDto {
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly property: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly bed_group: string;

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