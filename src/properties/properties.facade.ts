import { Injectable } from '@nestjs/common';

import { UsersConverter } from 'src/users/users.converter';
import { PropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/updateproperty.dto';
import { PropertiesConverter } from './properties.converter';
import { PropertiesService } from './properties.service';

@Injectable()
export class PropertiesFacade {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesConverter: PropertiesConverter,
    private readonly usersConverter: UsersConverter
  ) { }

  async getAll(): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findAll()
    );
  }

  async getOne(q: string): Promise<PropertyDto> {
    const doc = await this.propertiesService.findOne(q);
    return doc ? this.propertiesConverter.convertToDto(doc) : null;
  }

  async getAllByAvailability(checkin: Date, checkout: Date, country: string, city: string) {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findOneOrAllByAvailability(checkin, checkout, undefined, country, city)
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

  async updateOne(id: string, updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.update(id, updatePropertyDto)
    );
  }

  async getAdminUsers(id: string) {
    return this.usersConverter.convertToDtoArray(
      await this.propertiesService.getAdminUsers(id)
    );
  }
}