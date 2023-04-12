import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address {
  @Prop()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  country_code: string;

  @Prop()
  @IsNotEmpty()
  region: string;

  @Prop()
  @IsNotEmpty()
  city: string;

  @Prop()
  @IsNotEmpty()
  postal_code: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);