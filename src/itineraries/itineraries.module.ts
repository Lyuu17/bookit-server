
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';
import { ItinerariesConverter } from './itineraries.converter';
import { ItinerariesFacade } from './itineraries.facade';
import { ItinerariesService } from './itineraries.service';
import { Itinerary, ItinerarySchema } from './schema/itinerary.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Itinerary.name,
        useFactory: () => {
          const schema = ItinerarySchema;
          return schema;
        },
      }
    ]),
    UsersModule
  ],
  providers: [ItinerariesService, ItinerariesConverter, ItinerariesFacade],
  exports: [ItinerariesService, ItinerariesFacade],
})
export class ItinerariesModule { }