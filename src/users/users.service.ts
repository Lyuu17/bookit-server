import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const newUser = new this.userModel(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return await this.findByEmail(newUser.email) == null ? newUser.save() : null;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany().exec();
  }

  async addRole(id: string, role: Role): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { $addToSet: { roles: role } }, { new: true });
  }

  async removeRole(id: string, role: Role): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { $pull: { roles: role } }, { new: true });
  }
}