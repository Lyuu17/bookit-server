import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { Room, RoomSchema } from './room.schema';
import { IsNotEmpty } from 'class-validator';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({ default: now() })
  createdAt: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop([{ type: RoomSchema }])
  rooms: Room[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);