
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GeocodeController } from './geocode.controller';
import { GeocodeService } from './geocode.service';

@Module({
  imports: [ConfigModule],
  providers: [GeocodeService],
  exports: [GeocodeService],
  controllers: [GeocodeController]
})
export class GeocodeModule { }