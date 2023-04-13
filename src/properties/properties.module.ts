
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertiesService } from './properties.service';
import { Property, PropertySchema } from 'src/schemas/property.schema';
import { GeocodeModule } from 'src/geocode/geocode.module';

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
    GeocodeModule
  ],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}