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

  async getAll(userId: string): Promise<ItineraryDto[]> {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByUserId(userId)
    );
  }

  async getAllByUserId(userId: string): Promise<ItineraryDto[]> {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByUserId(userId)
    );
  }

  async getAllByPropertyId(propertyId: string): Promise<ItineraryDto[]> {
    return this.itinerariesConverter.convertToDtoArray(
      await this.itinerariesService.findAllByPropertyId(propertyId)
    );
  }

  async create(itineraryDto: ItineraryDto): Promise<ItineraryDto> {
    return this.itinerariesConverter.convertToDto(
      await this.itinerariesService.create(itineraryDto)
    );
  }
}