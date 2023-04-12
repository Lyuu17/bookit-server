import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateBedgroupConfigDto } from "./create-bedgroupconfig.dto";

export class CreateBedgroupDto {
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBedgroupConfigDto)
  readonly configuration: CreateBedgroupConfigDto[];
}