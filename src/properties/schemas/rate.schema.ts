import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { RateStatus } from 'src/enums/rate-status.enum';
import { AmenityDocument, AmenitySchema } from './amenity.schema';
import { BedgroupDocument, BedgroupSchema } from './bedgroup.schema';

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
  amenities: Types.DocumentArray<AmenityDocument>;

  @Prop([{ type: BedgroupSchema }])
  bed_groups: Types.DocumentArray<BedgroupDocument>;
}

export const RateSchema = SchemaFactory.createForClass(Rate);