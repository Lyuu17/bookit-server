import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersConverter {
  public convertToDto(userDocument: UserDocument): UserDto {
    return new UserDto(userDocument.toObject({ versionKey: false }));
  }

  public convertToDtoArray(userDocuments: UserDocument[]): UserDto[] {
    return userDocuments.map(document => this.convertToDto(document));
  }
}