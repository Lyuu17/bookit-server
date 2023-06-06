import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { GeocodeController } from './geocode/geocode.controller';
import { GeocodeModule } from './geocode/geocode.module';
import { ItinerariesController } from './itineraries/itineraries.controller';
import { ItinerariesConverter } from './itineraries/itineraries.converter';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { ItinerariesSeeder } from './itineraries/itineraries.seeder';
import { PropertiesController } from './properties/properties.controller';
import { PropertiesModule } from './properties/properties.module';
import { PropertiesSeeder } from './properties/properties.seeder';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersSeeder } from './users/users.seeder';

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
    AuthController,
    GeocodeController,
    PropertiesController,
    ItinerariesController,
    UsersController
  ],
  providers: [
    AppService,
    UsersSeeder,
    PropertiesSeeder,
    ItinerariesConverter,
    ItinerariesSeeder
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private usersSeeder: UsersSeeder,
    private propertiesSeeder: PropertiesSeeder,
    private itinerariesSeeder: ItinerariesSeeder
  ) { }

  async onModuleInit() {
    await this.usersSeeder.run();
    await this.propertiesSeeder.run();
    await this.itinerariesSeeder.run();
  }
}
