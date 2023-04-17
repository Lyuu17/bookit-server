import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesController } from './properties/properties.controller';
import { PropertiesModule } from './properties/properties.module';
import { GeocodeController } from './geocode/geocode.controller';
import { GeocodeModule } from './geocode/geocode.module';
import { UsersSeeder } from './users/users.seeder';
import { PropertiesSeeder } from './properties/properties.seeder';

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
      useFactory: async (config: ConfigService) => [{
        rootPath: join(__dirname, '..', config.get<string>('STATIC_DIR'))
      }]
    }), AuthModule, GeocodeModule, PropertiesModule, UsersModule
  ],
  controllers: [AppController, AuthController, GeocodeController, PropertiesController],
  providers: [AppService, UsersSeeder, PropertiesSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(
    private usersSeeder: UsersSeeder,
    private propertiesSeeder: PropertiesSeeder
  ) { }

  async onModuleInit() {
    if (process.env.DEV_ENV == "dev") {
      if (await this.usersSeeder.shouldRun())
        await this.usersSeeder.run();
      if (await this.propertiesSeeder.shouldRun())
        await this.propertiesSeeder.run();
    }
  }
}
