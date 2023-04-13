import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as NodeGeocoder from 'node-geocoder';

import { GeocodeResponseData } from './geocode.interface';


@Injectable()
export class GeocodeService {
  geocoder: any;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.geocoder = NodeGeocoder({ provider: configService.get<string>('GEOCODE_PROVIDER') });
  }

  async find(text: string): Promise<GeocodeResponseData[]> {
    return await this.geocoder.geocode(text);
  }
}