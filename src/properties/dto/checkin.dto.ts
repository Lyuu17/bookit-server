import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { IsNotEmpty, Min } from "class-validator";

export class CheckinDto {
  @Transform(({ value }) => value?.toString())
  @Exclude()
  readonly _id?: string;

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