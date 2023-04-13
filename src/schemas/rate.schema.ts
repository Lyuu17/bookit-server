import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { AmenitySchema, Amenity } from './amenity.schema';
import { Bedgroup, BedgroupSchema } from './bedgroup.schema';
import { RateStatus } from 'src/enums/rate-status.enum';

export type RateDocument = HydratedDocument<Rate>;

@Schema()
export class Rate {
  @Prop()
  @IsEnum(RateStatus)
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