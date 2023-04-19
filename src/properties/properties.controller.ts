import { Controller, Post, UseGuards, Body, Get, Req, Param, Query, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertyDto } from './dto/property.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { Property } from 'src/schemas/property.schema';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [PropertyDto] })
  async getAll(@Req() req) {
    return (await this.propertiesService.findAll())
      .map(prop => new PropertyDto(prop.toObject({ versionKey: false })));
  }

  @Get('availability/')
  @ApiOkResponse({ description: 'Get all properties by availability', type: [PropertyDto] })
  async getAllByAvailability(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string) {
    return (await this.propertiesService.findAllByAvailability(new Date(checkin), new Date(checkout)))
      .map(prop => new PropertyDto(prop.toObject({ versionKey: false })));
  }

  @Get(':q')
  @ApiOkResponse({ description: 'Get one property', type: PropertyDto })
  async getOne(@Param('q') q: string) {
    return new PropertyDto((await this.propertiesService.findOne(q)).toObject({ versionKey: false }));
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [PropertyDto] })
  async findByCity(@Param('q') q: string) {
    return (await this.propertiesService.findByCity(q))
      .map(prop => new PropertyDto(prop.toObject({ versionKey: false })));
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [PropertyDto] })
  async findByCountry(@Param('q') q: string) {
    return (await this.propertiesService.findByCountry(q))
      .map(prop => new PropertyDto(prop.toObject({ versionKey: false })));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: PropertyDto })
  async addOne(@Body() propertyDto: PropertyDto) {
    return new PropertyDto((await this.propertiesService.create(propertyDto)).toObject({ versionKey: false }));
  }
}
