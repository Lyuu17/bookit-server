import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { BedgroupConfigDto } from "./bedgroupconfig.dto";

export class BedgroupDto {
  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  @Expose({ name: 'id' })
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