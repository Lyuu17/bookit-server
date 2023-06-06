import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
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
  async getOneById(@Param('q') id: string) {
    return this.usersFacade.getOneById(id);
  }
}
