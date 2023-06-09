
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '@nestjs/config';
import { GeocodeModule } from 'src/geocode/geocode.module';
import { ItinerariesModule } from 'src/itineraries/itineraries.module';
import { UsersModule } from 'src/users/users.module';
import { PropertiesController } from './properties.controller';
import { PropertiesConverter } from './properties.converter';
import { PropertiesFacade } from './properties.facade';
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
    forwardRef(() => ItinerariesModule),
    GeocodeModule,
    ConfigModule,
    UsersModule
  ],
  providers: [PropertiesService, PropertiesConverter, PropertiesFacade],
  exports: [PropertiesService],
  controllers: [PropertiesController]
})
export class PropertiesModule { }