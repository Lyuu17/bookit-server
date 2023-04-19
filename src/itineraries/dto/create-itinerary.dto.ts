import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, Min } from "class-validator";

export class CreateItineraryDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly property: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly bed_group: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  readonly checkin: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  readonly checkout: string;

  @ApiProperty()
  @Min(1)
  readonly num_adults: number;

  @ApiProperty()
  @Min(0)
  readonly num_children: number;

  @ApiProperty()
  readonly special_request: string;
}