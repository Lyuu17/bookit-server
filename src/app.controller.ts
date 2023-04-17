import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

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
