import { Controller, Post, UseGuards, Body, Get, Req, Param, Query, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertyDto } from './dto/property.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { PropertiesConverter } from './properties.converter';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesConverter: PropertiesConverter
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [PropertyDto] })
  async getAll(@Req() req) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findAll()
    );
  }

  @Get('availability/')
  @ApiOkResponse({ description: 'Get all properties by availability', type: [PropertyDto] })
  async getAllByAvailability(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findAllByAvailability(new Date(checkin), new Date(checkout))
    );
  }

  @Get(':q')
  @ApiOkResponse({ description: 'Get one property', type: PropertyDto })
  async getOne(@Param('q') q: string) {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.findOne(q)
    );
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [PropertyDto] })
  async findByCity(@Param('q') q: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCity(q)
    );
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [PropertyDto] })
  async findByCountry(@Param('q') q: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCountry(q)
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: PropertyDto })
  async addOne(@Body() propertyDto: PropertyDto) {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.create(propertyDto)
    );
  }
}
