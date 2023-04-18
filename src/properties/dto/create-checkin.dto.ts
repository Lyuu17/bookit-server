import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min } from "class-validator";

export class CreateCheckin {
  @ApiProperty()
  @IsNotEmpty()
  readonly begin_time: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly end_time: string;

  @ApiProperty()
  readonly instructions: string;

  @ApiProperty()
  @Min(0)
  readonly min_age: number;
}