import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ItineraryDto } from './dto/itinerary.dto';
import { ItinerariesConverter } from './itineraries.converter';
import { ItinerariesService } from './itineraries.service';

@Controller('itineraries')
export class ItinerariesController {
  constructor(
    private readonly itinerariesService: ItinerariesService,
    private readonly itinerariesConverter: ItinerariesConverter
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Get all itineraries of the current user', type: [ItineraryDto] })
  async getAll(@Req() req) {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByUserId(req.user.userId)
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('user/:q')
  @ApiOkResponse({ description: 'Get all itineraries by user id', type: [ItineraryDto] })
  async getAllByUserId(@Param('q') q: string) {
    return isValidObjectId(q)
      ? this.itinerariesConverter.convertToDtoArray(await this.itinerariesService.findAllByUserId(q))
      : [];
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('property/:q')
  @ApiOkResponse({ description: 'Get all itineraries by property id', type: [ItineraryDto] })
  async getAllByPropertyId(@Param('q') q: string) {
    return isValidObjectId(q)
      ? this.itinerariesConverter.convertToDtoArray(await this.itinerariesService.findAllByPropertyId(q))
      : [];
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add an itinerary', type: ItineraryDto })
  @ApiBadRequestResponse({ description: 'Invalid checkin/checkout date' })
  async addOne(@Body() itineraryDto: ItineraryDto, @Req() req) {
    const dto = new ItineraryDto({ ...itineraryDto,
      user: req.user?.userId
    });

    const
      checkinDate = new Date(itineraryDto.checkin),
      checkoutDate = new Date(itineraryDto.checkout),
      currentDate = new Date();

    currentDate.setHours(0, 0, 0);
    if (checkinDate < currentDate || checkoutDate < currentDate) {
      throw new BadRequestException('Invalid checkin/checkout date. Date must be greater than today.');
    }

    return this.itinerariesConverter.convertToDto(
      await this.itinerariesService.create(dto)
    );
  }
}
