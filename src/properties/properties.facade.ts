import { Injectable } from '@nestjs/common';

import { PropertyDto } from './dto/property.dto';
import { PropertiesConverter } from './properties.converter';
import { PropertiesService } from './properties.service';

@Injectable()
export class PropertiesFacade {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesConverter: PropertiesConverter
  ) { }

  async getAll(): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findAll()
    );
  }

  async getOne(q: string) {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.findOne(q)
    );
  }

  async getAllByAvailability(checkin: Date, checkout: Date) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findOneOrAllByAvailability(checkin, checkout)
    );
  }

  async findOneOrAllByAvailability(checkin: Date, checkout: Date, q: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findOneOrAllByAvailability(checkin, checkout, q)
    );
  }

  async findByCity(q: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCity(q)
    );
  }

  async findByCountry(q: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCountry(q)
    );
  }

  async addOne(propertyDto: PropertyDto) {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.create(propertyDto)
    );
  }
}