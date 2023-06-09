import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types, now } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Address, AddressSchema } from './address.schema';
import { AmenityDocument, AmenitySchema } from './amenity.schema';
import { Checkin, CheckinSchema } from './checkin.schema';
import { ImageDocument, ImageSchema } from './image.schema';
import { LocationCoords, LocationCoordsSchema } from './locationcoords.schema';
import { RoomDocument, RoomSchema } from './room.schema';

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
  adminUsers: Types.DocumentArray<UserDocument>;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: CheckinSchema })
  @IsNotEmpty()
  checkin: Checkin;

  @Prop([{ type: AmenitySchema }])
  amenities: Types.DocumentArray<AmenityDocument>;

  @Prop([{ type: RoomSchema }])
  rooms: Types.DocumentArray<RoomDocument>;

  @Prop([{ type: ImageSchema }])
  images: Types.DocumentArray<ImageDocument>;
}

export const PropertySchema = SchemaFactory.createForClass(Property);