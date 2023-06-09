
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ItineraryDto } from './dto/itinerary.dto';
import { Itinerary, ItineraryDocument } from './schema/itinerary.schema';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectModel(Itinerary.name)
    private itineraryModel: Model<ItineraryDocument>,
  ) { }

  async create(itineraryDto: ItineraryDto): Promise<ItineraryDocument> {
    const itineraries
      = await this.findAllBetweenDatesWithinProperty(itineraryDto.property, new Date(itineraryDto.checkin), new Date(itineraryDto.checkout));

    if (itineraries.length > 0) {
      throw new BadRequestException('Invalid checkin/checkout date.');
    }

    const itinerary = new this.itineraryModel(itineraryDto);
    return await itinerary.save();
  }

  async findById(id: string): Promise<ItineraryDocument> {
    return this.itineraryModel.findById(id).exec();
  }

  async findAll(): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find().exec();
  }

  /* https://stackoverflow.com/a/32149021 */
  async findAllBetweenDates(checkin: Date, checkout: Date): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({
      $or: [
        { checkin: { $lte: checkin }, checkout: { $gt: checkin } },
        { checkin: { $lt: checkout }, checkout: { $gte: checkout } },
        { checkin: { $gt: checkin }, checkout: { $lt: checkout } },
        { checkin: checkin },
        { checkout: checkout }
      ]
    }).exec();
  }

  async findAllBetweenDatesWithinProperty(id: string, checkin: Date, checkout: Date): Promise<ItineraryDocument[]> {
    return this.itineraryModel.find({
      $and: [{
        $or: [
          { checkin: { $lte: checkin }, checkout: { $gt: checkin } },
          { checkin: { $lt: checkout }, checkout: { $gte: checkout } },
          { checkin: { $gt: checkin }, checkout: { $lt: checkout } },
          { checkin: checkin },
          { checkout: checkout }
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

  async deleteAll(): Promise<void> {
    await this.itineraryModel.deleteMany().exec();
  }
}