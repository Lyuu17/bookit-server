import { IsNotEmpty, Min } from "class-validator";

export class CreateBedgroupConfigDto {
  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly size: string;

  @Min(0)
  readonly quantity: number;
}