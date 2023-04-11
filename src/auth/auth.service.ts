import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';
import { UserAuthDto } from 'src/users/dto/user-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(userAuth: UserAuthDto) {
    const newUser = await this.usersService.create(userAuth);
    if (!newUser) {
      throw new HttpException('An account with that username already exists', HttpStatus.BAD_REQUEST);
    }
    
    const payload = { username: newUser.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}