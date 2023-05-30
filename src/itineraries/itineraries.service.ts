
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersService } from 'src/users/users.service';
import { ItineraryDto } from './dto/itinerary.dto';
import { Itinerary, ItineraryDocument } from './schema/itinerary.schema';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectModel(Itinerary.name)
    private itineraryModel: Model<ItineraryDocument>,

    private usersService: UsersService
  ) { }

  async create(itineraryDto: ItineraryDto, userId: string): Promise<ItineraryDocument> {
    const itineraries
      = await this.findAllBetweenDatesWithinProperty(itineraryDto.property, itineraryDto.checkin, itineraryDto.checkout);

    if (itineraries.length > 0) {
      throw new BadRequestException('Invalid checkin/checkout date.');
    }

    const itinerary = new this.itineraryModel(itineraryDto);
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
    return this.itineraryModel.find({
      $or: [
        { checkin: { $lte: checkin.toUTCString() }, checkout: { $gt: checkin.toUTCString() } },
        { checkin: { $lt: checkout.toUTCString() }, checkout: { $gte: checkout.toUTCString() } },
        { checkin: { $gt: checkin.toUTCString() }, checkout: { $lt: checkout.toUTCString() } },
        { checkin: checkin.toUTCString() },
        { checkout: checkout.toUTCString() }
      ]
    }).exec();
  }

  async findAllBetweenDatesWithinProperty(id: string, checkin: Date, checkout: Date): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({
      $and: [{
        $or: [
          { checkin: { $lte: checkin.toUTCString() }, checkout: { $gt: checkin.toUTCString() } },
          { checkin: { $lt: checkout.toUTCString() }, checkout: { $gte: checkout.toUTCString() } },
          { checkin: { $gt: checkin.toUTCString() }, checkout: { $lt: checkout.toUTCString() } },
          { checkin: checkin.toUTCString() },
          { checkout: checkout.toUTCString() }
        ]
      }, { property: id }]
    }).exec();
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

  async deleteMany(): Promise<void> {
    await this.itineraryModel.deleteMany().exec();
  }
}