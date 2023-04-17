import * as bcrypt from 'bcrypt';

import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthSuccessDto } from 'src/users/dto/auth-success.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    if (!newUser) {
      throw new UnauthorizedException('An account with that username already exists');
    }

    const payload = { username: newUser.email, sub: newUser._id };
    return new AuthSuccessDto({ access_token: await this.jwtService.signAsync(payload) });
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: user.email, sub: user._id };
    return new AuthSuccessDto({ access_token: await this.jwtService.signAsync(payload) });
  }
}