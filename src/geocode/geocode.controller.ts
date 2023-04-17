import { Controller, Get, Param } from '@nestjs/common';
import { GeocodeService } from './geocode.service';
import { ApiOkResponse } from '@nestjs/swagger';

import { GeocodeResponseDto } from './dto/geocode-response.dto';

@Controller('geocode')
export class GeocodeController {
  constructor(
    private readonly geocodeService: GeocodeService
  ) { }

  @Get(':q')
  @ApiOkResponse({ description: 'Search by geolocation', type: [GeocodeResponseDto] })
  async find(@Param('q') q) {
    const geoData = await this.geocodeService.find(q);

    const responsesDto = [];
    geoData.forEach(d => {
      responsesDto.push({
        latitude: d.latitude,
        longitude: d.longitude,
        formattedAddress: d.formattedAddress,
        country: d.country,
        city: d.city,
        state: d.state,
        countryCode: d.countryCode,
      });
    });
    return responsesDto;
  }
}
