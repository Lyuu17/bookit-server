import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Property } from './property.schema';
import { User } from './user.schema';
import { BedgroupConfig } from './bedgroupconfig.schema';
import { IsDateString, Min } from 'class-validator';

export type ItineraryDocument = HydratedDocument<Itinerary>;

@Schema()
export class Itinerary {
  @Prop({ type: SchemaTypes.ObjectId, ref: Itinerary.name })
  user: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: Property.name })
  property: Property;

  @Prop({ type: SchemaTypes.ObjectId, ref: BedgroupConfig.name })
  bed_group: string;

  @Prop()
  @IsDateString({ strict: true })
  checkin: string;

  @Prop()
  @IsDateString({ strict: true })
  checkout: string;

  @Prop()
  @Min(1)
  num_adults: number;

  @Prop()
  @Min(0)
  num_children: number;

  @Prop()
  special_request: string;
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);