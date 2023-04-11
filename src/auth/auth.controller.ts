import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserAuthDto } from 'src/users/dto/user-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, private readonly userService: UsersService
  ) {}

  @Post('register')
  async register(@Body() authDto: UserAuthDto) {
    return this.authService.register(authDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
