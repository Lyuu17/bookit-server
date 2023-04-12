import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { AmenitySchema, Amenity } from './amenity.schema';
import { Bedgroup, BedgroupSchema } from './bedgroup.schema';

export type RateDocument = HydratedDocument<Rate>;

@Schema()
export class Rate {
  @Prop()
  @IsNotEmpty()
  status: string;

  @Prop()
  @Min(0)
  available_rooms: number;

  @Prop()
  @IsNotEmpty()
  refundable: boolean;

  @Prop([{ type: AmenitySchema }])
  amenities: Amenity[];

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Bedgroup[];
}

export const RateSchema = SchemaFactory.createForClass(Rate);