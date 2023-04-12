import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min } from "class-validator";

export class CreateBedgroupConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly size: string;

  @ApiProperty()
  @Min(0)
  readonly quantity: number;
}