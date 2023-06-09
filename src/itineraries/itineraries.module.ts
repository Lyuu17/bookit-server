
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertiesModule } from 'src/properties/properties.module';
import { UsersModule } from 'src/users/users.module';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesConverter } from './itineraries.converter';
import { ItinerariesFacade } from './itineraries.facade';
import { ItinerariesSeeder } from './itineraries.seeder';
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
    UsersModule,
    forwardRef(() => PropertiesModule)
  ],
  providers: [ItinerariesService, ItinerariesConverter, ItinerariesFacade, ItinerariesSeeder],
  exports: [ItinerariesService],
  controllers: [ItinerariesController]
})
export class ItinerariesModule { }