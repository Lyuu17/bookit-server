import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';

@Injectable()
export class UsersSeeder {
  constructor(
    private usersService: UsersService
  ) { }

  async run() {
    await this.usersService.deleteMany();

    import('./users.json')
      .then(e => e.forEach(async u => await this.usersService.create(u)));
  }
}