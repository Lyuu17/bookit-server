
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UsersService } from 'src/users/users.service';
import { Itinerary, ItineraryDocument } from './schema/itinerary.schema';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectModel(Itinerary.name)
    private itineraryModel: Model<ItineraryDocument>,

    private usersService: UsersService
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

  /* https://stackoverflow.com/a/32149021 */
  async findAllBetweenDates(checkin: Date, checkout: Date): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({ $or: [
      { checkin : { $lte: checkin.toUTCString() }, checkout : { $gt: checkin.toUTCString() } },
      { checkin : { $lt: checkout.toUTCString() }, checkout : { $gte: checkout.toUTCString() } },
      { checkin : { $gt: checkin.toUTCString() }, checkout : { $lt: checkout.toUTCString() } },
      { checkin : checkin.toUTCString()},
      { checkout : checkout.toUTCString()}
    ]}).exec();
  }

  async findAllByUserId(id: string): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({ user: id }).exec();
  }

  async findAllByPropertyId(id: string): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({ property: id }).exec();
  }

  async count(): Promise<number> {
    return this.itineraryModel.countDocuments().exec();
  }
}