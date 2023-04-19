
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { Itinerary, ItineraryDocument } from 'src/schemas/itinerary.schema';
import { UsersService } from 'src/users/users.service';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectModel(Itinerary.name)
    private itineraryModel: Model<ItineraryDocument>,

    private usersService: UsersService,
    private propertiesService: PropertiesService
  ) { }

  async create(createItineraryDto: CreateItineraryDto, userId: string): Promise<ItineraryDocument> {
    const itinerary = new this.itineraryModel(createItineraryDto);
    itinerary.user = await this.usersService.findById(userId);
    return await itinerary.save();
  }

  async findOne(id: string): Promise<ItineraryDocument> {
    return this.itineraryModel.findById(id).exec();
  }

  async findAll(): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find().exec();
  }

  async findAllByUserId(id: string): Promise<ItineraryDocument[]> {
    const user = await this.usersService.findById(id);
    return this.itineraryModel.find({ user: user }).exec();
  }

  async findAllByPropertyId(id: string): Promise<ItineraryDocument[]> {
    const property = await this.propertiesService.findById(id);
    return this.itineraryModel.find({ property: property }).exec();
  }

  async count(): Promise<number> {
    return this.itineraryModel.countDocuments().exec();
  }
}