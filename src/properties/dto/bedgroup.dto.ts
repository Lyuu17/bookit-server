import { Transform, Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BedgroupConfigDto } from "./bedgroupconfig.dto";

export class BedgroupDto {
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BedgroupConfigDto)
  readonly configuration: BedgroupConfigDto[];
}