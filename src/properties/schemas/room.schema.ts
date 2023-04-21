import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Rate, RateSchema } from './rate.schema';
import { IsNotEmpty } from 'class-validator';
import { AmenitySchema, Amenity } from './amenity.schema';
import { BedgroupSchema, Bedgroup } from './bedgroup.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop([{ type: AmenitySchema }])
  amenities: Amenity[];

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Bedgroup[];

  /*
  @Prop([{ type: RateSchema }])
  rates: Rate[];
  */
}

export const RoomSchema = SchemaFactory.createForClass(Room);