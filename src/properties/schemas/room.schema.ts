import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { AmenityDocument, AmenitySchema } from './amenity.schema';
import { BedgroupDocument, BedgroupSchema } from './bedgroup.schema';
import { Image, ImageDocument } from './image.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop([{ type: AmenitySchema }])
  amenities: Types.DocumentArray<AmenityDocument>;

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Types.DocumentArray<BedgroupDocument>;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Image.name }])
  images: Types.DocumentArray<ImageDocument>;
}

export const RoomSchema = SchemaFactory.createForClass(Room);