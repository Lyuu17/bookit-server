import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersConverter } from './users.converter';
import { UsersService } from './users.service';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersConverter: UsersConverter
  ) { }

  async getAll(): Promise<UserDto[]> {
    return this.usersConverter.convertToDtoArray(
      await this.usersService.findAll()
    );
  }

  async getOneById(q: string) {
    return this.usersConverter.convertToDto(
      await this.usersService.findById(q)
    );
  }
}