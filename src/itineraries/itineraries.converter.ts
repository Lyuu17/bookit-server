import { Injectable } from '@nestjs/common';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItineraryDocument } from './schema/itinerary.schema';

@Injectable()
export class ItinerariesConverter {
  public convertToDto(itineraryDocument: ItineraryDocument): CreateItineraryDto {
    return new CreateItineraryDto(itineraryDocument.toObject({ versionKey: false }));
  }

  public convertToDtoArray(itineraryDocuments: ItineraryDocument[]): CreateItineraryDto[] {
    return itineraryDocuments.map(document => this.convertToDto(document));
  }
}