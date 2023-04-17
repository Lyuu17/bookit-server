import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';

@Injectable()
export class UsersSeeder {
  constructor(
    private usersService: UsersService
  ) { }

  async shouldRun() {
    return await this.usersService.count() == 0;
  }

  async run() {
    import('./users.json')
      .then(e => e.forEach(async u => await this.usersService.create(u)));
  }
}