import { Injectable } from '@nestjs/common';
import { ItineraryDto } from './dto/itinerary.dto';
import { ItineraryDocument } from './schema/itinerary.schema';

@Injectable()
export class ItinerariesConverter {
  public convertToDto(itineraryDocument: ItineraryDocument): ItineraryDto {
    return new ItineraryDto(itineraryDocument.toObject({ versionKey: false }));
  }

  public convertToDtoArray(itineraryDocuments: ItineraryDocument[]): ItineraryDto[] {
    return itineraryDocuments.map(document => this.convertToDto(document));
  }
}