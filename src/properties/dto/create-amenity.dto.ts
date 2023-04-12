import { IsEnum, IsNotEmpty } from "class-validator";
import { AmenityCategories } from "src/enums/amenity-categories.enum";

export class CreateAmenityDto {
  @IsNotEmpty()
  readonly name: string;

  readonly value: string;

  @IsEnum(AmenityCategories)
  readonly categories: string;
}