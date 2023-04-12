import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserAuthDto } from 'src/users/dto/user-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthSuccessDto } from 'src/users/dto/auth-success.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, private readonly userService: UsersService
  ) {}

  @Post('register')
  @ApiUnauthorizedResponse({ description: 'Account exists.'})
  @ApiOkResponse({ description: 'Auth token', type: AuthSuccessDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiUnauthorizedResponse({ description: 'Invalid email/password.'})
  @ApiOkResponse({ description: 'Auth token', type: AuthSuccessDto })
  async login(@Body() authDto: UserAuthDto) {
    return this.authService.login(authDto.email, authDto.password);
  }
}
