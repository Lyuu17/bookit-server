import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateBedgroupConfigDto } from "./create-bedgroupconfig.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBedgroupDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBedgroupConfigDto)
  readonly configuration: CreateBedgroupConfigDto[];
}