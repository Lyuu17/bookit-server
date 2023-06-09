import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthSuccessDto } from 'src/users/dto/auth-success.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto): Promise<AuthSuccessDto> {
    const newUser = await this.usersService.create(createUserDto);
    if (!newUser) {
      throw new UnauthorizedException('An account with that username already exists');
    }

    const payload = {
      sub: newUser._id,
      username: newUser.email,
      roles: newUser.roles
    };
    return new AuthSuccessDto({ access_token: await this.jwtService.signAsync(payload) });
  }

  async login(email: string, pass: string): Promise<AuthSuccessDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user._id,
      username: user.email,
      roles: user.roles
    };
    return new AuthSuccessDto({ access_token: await this.jwtService.signAsync(payload) });
  }
}