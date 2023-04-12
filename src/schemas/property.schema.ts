import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { Room, RoomSchema } from './room.schema';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ default: now() })
  createdAt: string;

  @Prop([{ type: RoomSchema }])
  rooms: Room[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);