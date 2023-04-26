import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class ImageDto {
  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  @Expose({ name: 'id' })
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly caption: string;

  @ApiProperty()
  readonly hero_image: boolean;

  @ApiProperty()
  readonly link: string;

  constructor(partial: Partial<ImageDto>) {
    Object.assign(this, partial);
  }
}