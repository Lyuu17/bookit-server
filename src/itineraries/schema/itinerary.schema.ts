import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, Min } from 'class-validator';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BedgroupConfig } from '../../properties/schemas/bedgroupconfig.schema';
import { Property } from '../../properties/schemas/property.schema';
import { User } from '../../users/schemas/user.schema';

export type ItineraryDocument = HydratedDocument<Itinerary>;

@Schema()
export class Itinerary {
  @Prop({ type: SchemaTypes.ObjectId, ref: Itinerary.name })
  user: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: Property.name })
  property: Property;

  @Prop([{ type: SchemaTypes.ObjectId, ref: BedgroupConfig.name }])
  bed_groups: Types.DocumentArray<BedgroupConfig>;

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