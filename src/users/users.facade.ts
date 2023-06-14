import { Injectable } from '@nestjs/common';
import { PropertyDto } from 'src/properties/dto/property.dto';
import { PropertiesConverter } from 'src/properties/properties.converter';
import { PropertiesService } from 'src/properties/properties.service';
import { UserDto } from './dto/user.dto';
import { UsersConverter } from './users.converter';
import { UsersService } from './users.service';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
    private readonly usersConverter: UsersConverter,
    private readonly propertiesConverter: PropertiesConverter
  ) { }

  async getAll(): Promise<UserDto[]> {
    return this.usersConverter.convertToDtoArray(
      await this.usersService.findAll()
    );
  }

  async getAllManagedByAdmin(id: string): Promise<PropertyDto[]> {
    return this.propertiesConverter.convertToDtoArray(
      await this.propertiesService.getAllManagedByAdmin(id)
    );
  }

  async findById(q: string): Promise<UserDto> {
    const doc = await this.usersService.findById(q);
    return doc ? this.usersConverter.convertToDto(doc) : null;
  }
}