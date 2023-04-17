import { Controller, Post, UseGuards, Body, Get, Req, Param } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [CreatePropertyDto] })
  async getAll(@Req() req) {
    return this.propertiesService.findAll();
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [CreatePropertyDto] })
  async findByCity(@Param('q') q: string) {
    return this.propertiesService.findByCity(q);
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [CreatePropertyDto] })
  async findByCountry(@Param('q') q: string) {
    return this.propertiesService.findByCountry(q);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: CreatePropertyDto })
  async addOne(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }
}
