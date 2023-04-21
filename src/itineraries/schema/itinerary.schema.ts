import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Property } from '../../properties/schemas/property.schema';
import { User } from '../../users/schemas/user.schema';
import { BedgroupConfig } from '../../properties/schemas/bedgroupconfig.schema';
import { IsDateString, Min } from 'class-validator';

export type ItineraryDocument = HydratedDocument<Itinerary>;

@Schema()
export class Itinerary {
  @Prop({ type: SchemaTypes.ObjectId, ref: Itinerary.name })
  user: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: Property.name })
  property: Property;

  @Prop([{ type: SchemaTypes.ObjectId, ref: BedgroupConfig.name }])
  bed_groups: [BedgroupConfig];

  @Prop({ type: SchemaTypes.Date })
  @IsDateString({ strict: true })
  checkin: Date;

  @Prop({ type: SchemaTypes.Date })
  @IsDateString({ strict: true })
  checkout: Date;

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