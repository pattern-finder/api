import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Challenge } from 'src/challenges/challenge.schema';

export type PictureDocument = Picture & Document;

@Schema()
export class Picture {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ type: Types.ObjectId, ref: Challenge.name })
  challenge: string;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
