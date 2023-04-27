import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Min } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type CheckinDocument = HydratedDocument<Checkin>;

@Schema()
export class Checkin {
  @Prop()
  @IsNotEmpty()
  readonly begin_time: string;

  @Prop()
  @IsNotEmpty()
  readonly end_time: string;

  @Prop()
  readonly instructions: string;

  @Prop()
  @Min(0)
  readonly min_age: number;
}

export const CheckinSchema = SchemaFactory.createForClass(Checkin);