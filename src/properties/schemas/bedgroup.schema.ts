import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { BedgroupConfigDocument, BedgroupConfigSchema } from './bedgroupconfig.schema';

export type BedgroupDocument = HydratedDocument<Bedgroup>;

@Schema()
export class Bedgroup {
  @Prop()
  @IsNotEmpty()
  description: string;

  @Prop([{ type: BedgroupConfigSchema }])
  @IsNotEmpty()
  configuration: Types.DocumentArray<BedgroupConfigDocument>;
}

export const BedgroupSchema = SchemaFactory.createForClass(Bedgroup);