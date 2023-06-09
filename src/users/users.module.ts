
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersConverter } from './users.converter';
import { UsersFacade } from './users.facade';
import { UsersSeeder } from './users.seeder';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      }
    ])
  ],
  providers: [UsersService, UsersConverter, UsersFacade, UsersSeeder],
  exports: [UsersService, UsersConverter, UsersFacade],
  controllers: [UsersController]
})
export class UsersModule { }