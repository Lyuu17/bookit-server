import { Injectable } from '@nestjs/common';

import { ItinerariesService } from './itineraries.service';

@Injectable()
export class ItinerariesSeeder {
  constructor(
    private itinerariesService: ItinerariesService
  ) {
    this.itinerariesService.deleteAll()
      .then(() => {
        import('./itineraries.json')
          .then(e => e.forEach(async (dto: any) => {
            dto.checkin = new Date(dto.checkin);
            dto.checkout = new Date(dto.checkout);

            await this.itinerariesService.create(dto);
          }));
      })
  }
}