
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ItinerariesService } from './itineraries.service';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { Itinerary, ItinerarySchema } from 'src/schemas/itinerary.schema';

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
    UsersModule, PropertiesModule
  ],
  providers: [ItinerariesService],
  exports: [ItinerariesService],
})
export class ItinerariesModule { }