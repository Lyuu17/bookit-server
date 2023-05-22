import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, Min } from "class-validator";

export class BedgroupConfigDto {
  @Transform(({ value }) => value.toString())
  @Expose({ name: 'id' })
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly size: string;

  @ApiProperty()
  @Min(0)
  readonly quantity: number;

  @ApiProperty()
  @Min(0)
  readonly base_price: number;
}