
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User| null> {
    const newUser = new this.userModel(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return await this.findOne(newUser.email) == null ? newUser.save() : null;
  }

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }
}