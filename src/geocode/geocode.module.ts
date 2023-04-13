
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GeocodeService } from './geocode.service';

@Module({
  imports: [ConfigModule],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}