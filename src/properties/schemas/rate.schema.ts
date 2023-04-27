import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { RateStatus } from 'src/enums/rate-status.enum';
import { Amenity, AmenitySchema } from './amenity.schema';
import { Bedgroup, BedgroupSchema } from './bedgroup.schema';

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
  amenities: Types.DocumentArray<Amenity>;

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Types.DocumentArray<Bedgroup>;
}

export const RateSchema = SchemaFactory.createForClass(Rate);