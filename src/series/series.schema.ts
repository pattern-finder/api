import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Challenge } from 'src/challenges/challenge.schema';
import { Document, Types } from 'mongoose';

export type SerieDocument = Serie & Document;

@Schema()
export class Serie {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: Challenge.name })
  challenges: string[];

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const SerieSchema = SchemaFactory.createForClass(Serie);
