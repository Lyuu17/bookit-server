import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';

@Injectable()
export class UsersSeeder {
  constructor(
    private usersService: UsersService
  ) {
    this.usersService.deleteAll()
      .then(() => {
        import('./users.json')
          .then(e => e.forEach(async u => await this.usersService.create(u)));
      });
  }
}