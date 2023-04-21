import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const newUser = new this.userModel(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return await this.findOne(newUser.email) == null ? newUser.save() : null;
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}