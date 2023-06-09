import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { PropertiesFacade } from 'src/properties/properties.facade';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersFacade } from 'src/users/users.facade';
import { ItineraryDto } from './dto/itinerary.dto';
import { ItinerariesFacade } from './itineraries.facade';

@Controller('itineraries')
export class ItinerariesController {
  constructor(
    private readonly itinerariesFacade: ItinerariesFacade,
    private readonly propertiesFacade: PropertiesFacade,
    private readonly usersFacade: UsersFacade
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Get all itineraries of the current user', type: [ItineraryDto] })
  async getAll(@Req() req): Promise<ItineraryDto[]> {
    return this.itinerariesFacade.getAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('user/:q')
  @ApiOkResponse({ description: 'Get all itineraries by user id', type: [ItineraryDto] })
  @ApiBadRequestResponse({ description: 'Invalid user' })
  @ApiBadRequestResponse()
  async getAllByUserId(@Param('q') q: string): Promise<ItineraryDto[]> {
    if (!isMongoId(q)) {
      throw new BadRequestException();
    }

    const user = await this.usersFacade.findById(q);
    if (user == null) {
      throw new BadRequestException('Invalid user.');
    }

    return this.itinerariesFacade.getAllByUserId(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('property/:q')
  @ApiOkResponse({ description: 'Get all itineraries by property id', type: [ItineraryDto] })
  @ApiBadRequestResponse()
  async getAllByPropertyId(@Param('q') q: string): Promise<ItineraryDto[]> {
    if (!isMongoId(q)) {
      throw new BadRequestException();
    }

    const property = await this.propertiesFacade.findById(q);
    if (property == null) {
      throw new BadRequestException('Invalid property.');
    }

    return this.itinerariesFacade.getAllByPropertyId(q);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Add an itinerary', type: ItineraryDto })
  @ApiBadRequestResponse({ description: 'Invalid checkin/checkout date' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  async create(@Body() itineraryDto: ItineraryDto, @Req() req): Promise<ItineraryDto> {
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

    const property = await this.propertiesFacade.findById(dto.property);
    if (property == null) {
      throw new BadRequestException('Invalid property.');
    }

    return this.itinerariesFacade.create(dto);
  }
}
