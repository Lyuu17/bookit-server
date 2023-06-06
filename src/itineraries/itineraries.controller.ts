import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { PropertiesService } from 'src/properties/properties.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersService } from 'src/users/users.service';
import { ItineraryDto } from './dto/itinerary.dto';
import { ItinerariesFacade } from './itineraries.facade';

@Controller('itineraries')
export class ItinerariesController {
  constructor(
    private readonly itinerariesFacade: ItinerariesFacade,
    private readonly propertiesService: PropertiesService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Get all itineraries of the current user', type: [ItineraryDto] })
  async getAll(@Req() req) {
    return this.itinerariesFacade.getAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('user/:q')
  @ApiOkResponse({ description: 'Get all itineraries by user id', type: [ItineraryDto] })
  @ApiBadRequestResponse({ description: 'Invalid user' })
  @ApiBadRequestResponse()
  async getAllByUserId(@Param('q') q: string) {
    if (!isMongoId(q)) {
      throw new BadRequestException();
    }

    const user = await this.usersService.findOne(q);
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
  async getAllByPropertyId(@Param('q') q: string) {
    if (!isMongoId(q)) {
      throw new BadRequestException();
    }

    const property = await this.propertiesService.findOne(q);
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

    const property = await this.propertiesService.findOne(dto.property);
    if (property == null) {
      throw new BadRequestException('Invalid property.');
    }

    return this.itinerariesFacade.addOne(dto);
  }
}
