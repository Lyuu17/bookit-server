import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserDto } from './dto/user.dto';
import { UsersFacade } from './users.facade';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersFacade: UsersFacade
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({ description: 'Get all users', type: [UserDto] })
  async getAll() {
    return this.usersFacade.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':q')
  @ApiOkResponse({ description: 'Get user by user id', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  async getOneById(@Param('q') id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException();
    }

    const user = await this.usersFacade.getOneById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
