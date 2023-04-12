import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Property, PropertyDocument } from '../schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(@InjectModel(Property.name) private propertyModel: Model<PropertyDocument>) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyDocument| null> {
    const newProperty = new this.propertyModel(createPropertyDto);
    return await newProperty.save();
  }

  async findAll(): Promise<PropertyDocument[] | null> {
    return this.propertyModel.find().exec();
  }

  async findOne(id: string): Promise<PropertyDocument | null> {
    return this.propertyModel.findOne({ _id: id }).exec();
  }
}