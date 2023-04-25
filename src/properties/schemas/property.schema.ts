import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, SchemaTypes, now } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Address, AddressSchema } from './address.schema';
import { Amenity, AmenitySchema } from './amenity.schema';
import { Checkin, CheckinSchema } from './checkin.schema';
import { Image, ImageSchema } from './image.schema';
import { LocationCoords, LocationCoordsSchema } from './locationcoords.schema';
import { Room, RoomSchema } from './room.schema';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({ type: AddressSchema })
  @IsNotEmpty()
  address: Address;

  @Prop({ type: LocationCoordsSchema })
  @IsNotEmpty()
  location_coords: LocationCoords;

  @Prop()
  @IsNotEmpty()
  phone: string;

  @Prop({ default: now() })
  createdAt: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: User.name }])
  adminUsers: [User];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: CheckinSchema })
  @IsNotEmpty()
  checkin: Checkin;

  @Prop([{ type: AmenitySchema }])
  amenities: Amenity[];

  @Prop([{ type: RoomSchema }])
  rooms: Room[];

  @Prop([{ type: ImageSchema }])
  images: Image[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);