import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Property, PropertyDocument } from '../schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { GeocodeService } from 'src/geocode/geocode.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    private readonly geocodeService: GeocodeService
  ) { }

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyDocument | null> {
    const newProperty = new this.propertyModel(createPropertyDto);
    return await newProperty.save();
  }

  async findAll(): Promise<PropertyDocument[] | null> {
    return this.propertyModel.find().exec();
  }

  async findOne(id: string): Promise<PropertyDocument | null> {
    return this.propertyModel.findById(id).exec();
  }

  async findByCity(q: string): Promise<PropertyDocument[] | null> {
    const geoData = await this.geocodeService.find(q);
    return this.propertyModel.find({
      'address.country_code': geoData[0]?.countryCode,
      'address.region': geoData[0]?.state,
      'address.city': geoData[0]?.city
    }).exec();
  }

  async findByCountry(q: string): Promise<PropertyDocument[] | null> {
    const geoData = await this.geocodeService.find(q);
    return this.propertyModel.find({
      'address.country_code': geoData[0]?.countryCode
    }).exec();
  }

  async count(): Promise<number> {
    return this.propertyModel.countDocuments().exec();
  }

  async addAdminUser(propertyId: string, userId: string) {
    return this.propertyModel.findByIdAndUpdate(propertyId, { $addToSet: { adminUsers: userId } }, { new: true }).exec();
  }

  async removeAdminUser(propertyId: string, ownerId: string) {
    return this.propertyModel.findByIdAndUpdate(propertyId, { $pull: { owners: ownerId } }, { new: true }).exec();
  }

  async getAdminUsers(propertyId: string) {
    const property = await this.propertyModel.findById(propertyId).populate('adminUsers');
    return property.adminUsers;
  }
}