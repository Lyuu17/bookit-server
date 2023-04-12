import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Rate, RateSchema } from './rate.schema';
import { IsNotEmpty } from 'class-validator';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop([{ type: RateSchema }])
  rates: Rate[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);