import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";
import { AmenityCategories } from "src/enums/amenity-categories.enum";

export class AmenityDto {
  @Transform(({ value }) => value.toString())
  @Exclude()
  readonly _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  readonly value: string;

  @ApiProperty({ 
    description: "Categories: accessibility┃accessible_bathroom┃accessible_parking┃accessible_wheelchair┃air_conditioning┃airport_transfer┃bar┃casino┃crib┃dry_cleaning_laundry┃dryer┃free_airport_transfer┃free_breakfast┃free_wifi┃gym┃kitchen┃meeting_facility┃ocean_view┃parking┃pets_allowed┃restaurant_in_hotel┃spa_services┃swimming_pool┃washer┃wifi"
  })
  @IsEnum(AmenityCategories)
  readonly categories: string;
}