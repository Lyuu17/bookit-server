import { BadRequestException, Controller, Get, NotFoundException, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { PropertyDto } from 'src/properties/dto/property.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserDto } from './dto/user.dto';
import { UsersFacade } from './users.facade';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersFacade: UsersFacade
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ description: 'Profile data.' })
  async getProfile(@Request() req) {
    return this.usersFacade.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({ description: 'Get all users', type: [UserDto] })
  async getAll(): Promise<UserDto[]> {
    return this.usersFacade.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('properties')
  @ApiOkResponse({ description: 'Get all properties managed by this user', type: [PropertyDto] })
  async getAllManagedByAdmin(@Request() req): Promise<PropertyDto[]> {
    return this.usersFacade.getAllManagedByAdmin(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':q')
  @ApiOkResponse({ description: 'Get user by user id', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  async findById(@Param('q') id: string): Promise<UserDto> {
    if (!isMongoId(id)) {
      throw new BadRequestException();
    }

    const user = await this.usersFacade.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
