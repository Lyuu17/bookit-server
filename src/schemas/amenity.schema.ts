import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { AmenityCategories } from 'src/enums/amenity-categories.enum';

export type AmenityDocument = HydratedDocument<Amenity>;

@Schema()
export class Amenity {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  value: string;

  @Prop()
  @IsEnum(AmenityCategories)
  categories: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);