import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ImageDto {
  @ApiProperty()
  @IsNotEmpty()
  caption: string;

  @ApiProperty()
  hero_image: boolean;

  @ApiProperty()
  @IsNotEmpty()
  link: string;
}