import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    return user ? user : null;
  }

  async validateLogin(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: any) {
    const newUser = await this.usersService.create(user);
    if (newUser)
    {
      const payload = { username: user.username, sub: user.userId };
      return { access_token: this.jwtService.sign(payload) };
    }
    throw new HttpException('An account with that username already exists', HttpStatus.BAD_REQUEST);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return { access_token: this.jwtService.sign(payload) };
  }
}