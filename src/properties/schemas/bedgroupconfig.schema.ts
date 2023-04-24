import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type BedgroupConfigDocument = HydratedDocument<BedgroupConfig>;

@Schema()
export class BedgroupConfig {
  @Prop()
  _id: string;

  @Prop()
  @IsNotEmpty()
  type: string;

  @Prop()
  @IsNotEmpty()
  size: string;

  @Prop()
  @Min(0)
  quantity: number;
}

export const BedgroupConfigSchema = SchemaFactory.createForClass(BedgroupConfig);