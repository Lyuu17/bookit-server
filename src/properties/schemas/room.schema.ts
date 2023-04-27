import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Amenity, AmenitySchema } from './amenity.schema';
import { Bedgroup, BedgroupSchema } from './bedgroup.schema';
import { Image } from './image.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop([{ type: AmenitySchema }])
  amenities: Types.DocumentArray<Amenity>;

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Types.DocumentArray<Bedgroup>;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Image.name }])
  images: Types.DocumentArray<Image>;

  /*
  @Prop([{ type: RateSchema }])
  rates: Types.DocumentArray<Rate>;
  */
}

export const RoomSchema = SchemaFactory.createForClass(Room);