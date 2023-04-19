import { Controller, Post, UseGuards, Body, Get, Req, Param, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { Property } from 'src/schemas/property.schema';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [Property] })
  async getAll(@Req() req) {
    return this.propertiesService.findAll();
  }

  @Get('availability/')
  @ApiOkResponse({ description: 'Get all properties by availability', type: [Property] })
  async getAllByAvailability(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string) {
    return this.propertiesService.findAllByAvailability(new Date(checkin), new Date(checkout));
  }

  @Get(':q')
  @ApiOkResponse({ description: 'Get one property', type: Property })
  async getOne(@Param('q') q: string) {
    return this.propertiesService.findOne(q);
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [Property] })
  async findByCity(@Param('q') q: string) {
    return this.propertiesService.findByCity(q);
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [Property] })
  async findByCountry(@Param('q') q: string) {
    return this.propertiesService.findByCountry(q);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: Property })
  async addOne(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }
}
