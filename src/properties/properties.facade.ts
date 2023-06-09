import { Injectable } from '@nestjs/common';

import { UserDto } from 'src/users/dto/user.dto';
import { UsersConverter } from 'src/users/users.converter';
import { PropertyDto, UpdatePropertyDto } from './dto/property.dto';
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

  async findById(q: string): Promise<PropertyDto> {
    const doc = await this.propertiesService.findById(q);
    return doc ? this.propertiesConverter.convertToDto(doc) : null;
  }

  async getAllByAvailability(checkin: Date, checkout: Date, country: string, city: string): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findOneOrAllByAvailability(checkin, checkout, undefined, country, city)
    );
  }

  async findOneOrAllByAvailability(checkin: Date, checkout: Date, q: string): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findOneOrAllByAvailability(checkin, checkout, q)
    );
  }

  async findByCity(q: string): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCity(q)
    );
  }

  async findByCountry(q: string): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.findByCountry(q)
    );
  }

  async addOne(propertyDto: PropertyDto): Promise<PropertyDto> {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.create(propertyDto)
    );
  }

  async updateOne(id: string, updatePropertyDto: UpdatePropertyDto): Promise<PropertyDto> {
    return this.propertiesConverter.convertToDto(
      await this.propertiesService.update(id, updatePropertyDto)
    );
  }

  async getAdminUsers(id: string): Promise<UserDto[]> {
    return this.usersConverter.convertToDtoArray(
      await this.propertiesService.getAdminUsers(id)
    );
  }
}