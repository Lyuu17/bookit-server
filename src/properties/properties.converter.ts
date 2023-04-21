import { Injectable } from '@nestjs/common';
import { PropertyDto } from './dto/property.dto';
import { PropertyDocument } from './schemas/property.schema';

@Injectable()
export class PropertiesConverter {
  public convertToDto(propertyDocument: PropertyDocument): PropertyDto {
    return new PropertyDto(propertyDocument.toObject({ versionKey: false }));
  }

  public convertToDtoArray(propertyDocuments: PropertyDocument[]): PropertyDto[] {
    return propertyDocuments.map(document => this.convertToDto(document));
  }
}