
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '@nestjs/config';
import { GeocodeModule } from 'src/geocode/geocode.module';
import { ItinerariesModule } from 'src/itineraries/itineraries.module';
import { PropertiesService } from './properties.service';
import { Property, PropertySchema } from './schemas/property.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Property.name,
        useFactory: () => {
          const schema = PropertySchema;
          return schema;
        },
      }
    ]),
    ItinerariesModule,
    GeocodeModule,
    ConfigModule
  ],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule { }