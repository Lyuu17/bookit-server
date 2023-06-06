import { Injectable } from '@nestjs/common';

import { ItineraryDto } from './dto/itinerary.dto';
import { ItinerariesConverter } from './itineraries.converter';
import { ItinerariesService } from './itineraries.service';

@Injectable()
export class ItinerariesFacade {
  constructor(
    private readonly itinerariesService: ItinerariesService,
    private readonly itinerariesConverter: ItinerariesConverter
  ) { }

  async getAll(userId: string) {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByUserId(userId)
    );
  }

  async getAllByUserId(userId: string) {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByUserId(userId)
    );
  }

  async getAllByPropertyId(propertyId: string) {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByPropertyId(propertyId)
    );
  }

  async addOne(itineraryDto: ItineraryDto) {
    return this.itinerariesConverter.convertToDto(
      await this.itinerariesService.create(itineraryDto)
    );
  }
}