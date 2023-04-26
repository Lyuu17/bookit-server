import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ImageDto {
  @ApiProperty()
  readonly image_id?: string;

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