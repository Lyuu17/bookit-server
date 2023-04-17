import { Injectable } from '@nestjs/common';

import { PropertiesService } from './properties.service';

@Injectable()
export class PropertiesSeeder {
  constructor(
    private propertiesService: PropertiesService
  ) { }

  async shouldRun() {
    return await this.propertiesService.count() == 0;
  }

  async run() {
    import('./properties.json')
      .then(e => e.forEach(async p => await this.propertiesService.create(p)));
  }
}