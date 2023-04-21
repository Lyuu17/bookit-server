import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ description: 'Profile data.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
