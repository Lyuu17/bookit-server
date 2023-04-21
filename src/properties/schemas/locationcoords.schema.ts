import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type LocationCoordsDocument = HydratedDocument<LocationCoords>;

@Schema()
export class LocationCoords {
  @Prop()
  @IsNotEmpty()
  readonly latitude: number;

  @Prop()
  @IsNotEmpty()
  readonly longitude: number;
}

export const LocationCoordsSchema = SchemaFactory.createForClass(LocationCoords);