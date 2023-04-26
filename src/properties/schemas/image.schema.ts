import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop()
  image_id: string;

  @Prop()
  @IsNotEmpty()
  caption: string;

  @Prop()
  hero_image: boolean;

  @Prop()
  @IsString()
  link: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);