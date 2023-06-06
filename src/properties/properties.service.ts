import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { rm } from 'fs';
import { join, relative } from 'path';
import { GeocodeService } from 'src/geocode/geocode.service';
import { ItinerariesService } from 'src/itineraries/itineraries.service';
import { ImageDto } from './dto/image.dto';
import { PropertyDto } from './dto/property.dto';
import { Property, PropertyDocument } from './schemas/property.schema';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    private readonly itinerariesService: ItinerariesService,
    private readonly geocodeService: GeocodeService
  ) { }

  async create(propertyDto: PropertyDto): Promise<PropertyDocument | null> {
    const newProperty = new this.propertyModel(propertyDto);
    return newProperty.save();
  }

  async findById(id: string): Promise<PropertyDocument> {
    return this.propertyModel.findById(id).exec();
  }

  async findAll(): Promise<PropertyDocument[] | null> {
    return this.propertyModel.find().exec();
  }

  async findOneOrAllByAvailability(checkin: Date, checkout: Date, id?: string, country?: string, city?: string): Promise<PropertyDocument[] | null> {
    const itineraries = typeof id === 'undefined'
      ? await this.itinerariesService.findAllBetweenDates(checkin, checkout)
      : await this.itinerariesService.findAllBetweenDatesWithinProperty(id, checkin, checkout);

    /* store bed configuration as key: id, value: array */
    const bedconfigs = {};
    itineraries.forEach(itinerary => {
      itinerary.bed_groups.forEach(bedgroupConfig => {
        bedconfigs[bedgroupConfig.id.toString()] ||= [];
        bedconfigs[bedgroupConfig.id.toString()] = [...bedconfigs[bedgroupConfig.id.toString()], itinerary];
      });
    });

    const propertyModels = typeof id === 'undefined'
      ? await this.findByCountryAndCity(country, city)
      : [await this.findOne(id)];

    // update availability based on itineraries
    propertyModels.forEach(prop => {
      prop.rooms.forEach(room => {
        room.bed_groups.forEach(bedgroup => {
          bedgroup.configuration.forEach(bedgroupConfig => {
            if (bedgroupConfig.id.toString() in bedconfigs)
              bedgroupConfig.quantity = bedgroupConfig.quantity - bedconfigs[bedgroupConfig.id.toString()].length; // update quantity
          });
        });
      });
    });

    return propertyModels
      .filter(prop => prop.rooms
        .filter(room => room.bed_groups
          .filter(bedgroup => bedgroup.configuration
            .filter(bedgroupConfig => bedgroupConfig.quantity == 0).length == 0
          ).length == 0
        ).length == 0);
  }

  async findOne(id: string): Promise<PropertyDocument | null> {
    return isValidObjectId(id) ? this.propertyModel.findById(id).exec() : null;
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

  async findByCountryAndCity(country: string, city: string): Promise<PropertyDocument[] | null> {
    const geoData = await this.geocodeService.find(`${city}, ${country}`);
    return this.propertyModel.find({
      'address.country_code': geoData[0]?.countryCode,
      'address.region': geoData[0]?.state,
      'address.city': geoData[0]?.city
    }).exec();
  }

  async count(): Promise<number> {
    return this.propertyModel.countDocuments().exec();
  }

  async deleteMany(): Promise<void> {
    await this.propertyModel.deleteMany().exec();
  }

  async addAdminUser(propertyId: string, userId: string) {
    return isValidObjectId(propertyId) && isValidObjectId(userId)
      ? this.propertyModel.findByIdAndUpdate(propertyId, { $addToSet: { adminUsers: userId } }, { new: true }).exec()
      : null;
  }

  async removeAdminUser(propertyId: string, userId: string) {
    return isValidObjectId(propertyId) && isValidObjectId(userId)
      ? this.propertyModel.findByIdAndUpdate(propertyId, { $pull: { adminUsers: userId } }, { new: true }).exec()
      : null;
  }

  async getAdminUsers(propertyId: string) {
    return isValidObjectId(propertyId)
      ? (await this.propertyModel.findById(propertyId).populate('adminUsers')).adminUsers
      : null;
  }

  async uploadPropertyImage(propertyId: string, imageDto: ImageDto, file: Express.Multer.File): Promise<ImageDto> {
    if (file == null) {
      throw new BadRequestException('Upload failed');
    }

    const property = await this.propertyModel.findById(propertyId);
    if (property == null) {
      throw new BadRequestException('Property not found');
    }

    const imageDtoWithLink = new ImageDto({
      ...imageDto,
      link: join(relative(process.cwd(), file.destination), file.filename)
    });

    await this.propertyModel.findOneAndUpdate({ _id: propertyId }, { $addToSet: { images: imageDtoWithLink } }, { new: true }).exec();

    return imageDtoWithLink;
  }

  async deletePropertyImage(propertyId: string, imageId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (property == null) {
      throw new BadRequestException('Property not found');
    }

    const images = property.images.filter(image => image.id == imageId);
    if (images.length == 0) {
      throw new BadRequestException('Image not found');
    }

    await this.propertyModel.findByIdAndUpdate(propertyId, { $pull: { images: { _id: images[0].id } } }, { new: true }).exec();

    rm(join(process.cwd(), images[0].link), () => { });
  }

  async addRoomImage(propertyId: string, roomId: string, imageId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (property == null) {
      throw new BadRequestException('Property not found');
    }

    const rooms = property.rooms.filter(room => room.id == roomId);
    if (rooms.length == 0) {
      throw new BadRequestException('Room not found');
    }

    const images = property.images.filter(image => image.id == imageId);
    if (images.length == 0) {
      throw new BadRequestException('Image not found');
    }

    await this.propertyModel.findOneAndUpdate(
      { _id: propertyId, 'rooms.name': rooms[0].name },
      { $addToSet: { 'rooms.$.images': imageId }})
      .exec();
  }

  async removeRoomImage(propertyId: string, roomId: string, imageId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (property == null) {
      throw new BadRequestException('Property not found');
    }

    const rooms = property.rooms.filter(room => room.id == roomId);
    if (rooms.length == 0) {
      throw new BadRequestException('Room not found');
    }

    const images = property.images.filter(image => image.id == imageId);
    if (images.length == 0) {
      throw new BadRequestException('Image not found');
    }

    await this.propertyModel.findOneAndUpdate(
      { _id: propertyId, 'rooms.name': rooms[0].name },
      { $pull: { 'rooms.$.images': imageId }})
      .exec();
  }
}