import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthSuccessDto } from 'src/users/dto/auth-success.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserAuthDto } from 'src/users/dto/user-auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  @ApiUnauthorizedResponse({ description: 'Account exists.' })
  @ApiOkResponse({ description: 'Auth token', type: AuthSuccessDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthSuccessDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiUnauthorizedResponse({ description: 'Invalid email/password.' })
  @ApiOkResponse({ description: 'Auth token', type: AuthSuccessDto })
  async login(@Body() authDto: UserAuthDto): Promise<AuthSuccessDto> {
    return this.authService.login(authDto.email, authDto.password);
  }
}
