import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GeocodeModule } from './geocode/geocode.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { PropertiesModule } from './properties/properties.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      })
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => [
        {
          rootPath: join(__dirname, '..', config.get<string>('STATIC_DIR')),
          exclude: ['/api/(.*)'],
          renderPath: '/'
        },
        {
          rootPath: join(__dirname, '..', config.get<string>('PUBLIC_DIR')),
          exclude: ['/public/(.*)'],
          serveRoot: '/public',
        }
      ]
    }),
    AuthModule,
    GeocodeModule,
    PropertiesModule,
    UsersModule,
    ItinerariesModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }
