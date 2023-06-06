
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersConverter } from './users.converter';
import { UsersFacade } from './users.facade';
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
  providers: [UsersService, UsersConverter, UsersFacade],
  exports: [UsersService, UsersFacade],
})
export class UsersModule { }