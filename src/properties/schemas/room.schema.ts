import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Amenity, AmenitySchema } from './amenity.schema';
import { Bedgroup, BedgroupSchema } from './bedgroup.schema';
import { Image } from './image.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop()
  _id: string;

  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop([{ type: AmenitySchema }])
  amenities: Amenity[];

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Bedgroup[];

  @Prop([{ type: SchemaTypes.ObjectId, ref: Image.name }])
  images: Image[];

  /*
  @Prop([{ type: RateSchema }])
  rates: Rate[];
  */
}

export const RoomSchema = SchemaFactory.createForClass(Room);