
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertiesService } from './properties.service';
import { Property, PropertySchema } from 'src/schemas/property.schema';

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
    ])
  ],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}