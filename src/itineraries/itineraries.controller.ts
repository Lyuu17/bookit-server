import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItinerariesService } from './itineraries.service';
import { Itinerary } from './schema/itinerary.schema';

@Controller('itineraries')
export class ItinerariesController {
  constructor(
    private readonly itinerariesService: ItinerariesService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Get all itineraries of the current user', type: [Itinerary] })
  async getAll(@Req() req) {
    return this.itinerariesService.findAllByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:q')
  @ApiOkResponse({ description: 'Get all itineraries by user id', type: [Itinerary] })
  async getAllByUserId(@Param('q') q: string) {
    return isValidObjectId(q) ? this.itinerariesService.findAllByUserId(q) : [];
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:q')
  @ApiOkResponse({ description: 'Get all itineraries by property id', type: [Itinerary] })
  async getAllByPropertyId(@Param('q') q: string) {
    return isValidObjectId(q) ? this.itinerariesService.findAllByPropertyId(q) : [];
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add an itinerary', type: Itinerary })
  async addOne(@Body() createItineraryDto: CreateItineraryDto, @Req() req) {
    return this.itinerariesService.create(createItineraryDto, req.user?.userId);
  }
}
