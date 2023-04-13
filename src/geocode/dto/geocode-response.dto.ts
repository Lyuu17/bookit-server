import { ApiProperty } from "@nestjs/swagger";

export class GeocodeResponseDto {
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  formattedAddress: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  countryCode: string;

  constructor(partial: Partial<GeocodeResponseDto>) {
    Object.assign(this, partial);
  }
}