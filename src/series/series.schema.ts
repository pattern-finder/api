import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Challenge } from 'src/challenges/challenge.schema';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type SerieDocument = Serie & Document;

@Schema()
export class Serie {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: Challenge.name })
  challenges: string[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: string;

  @Prop({ default: false })
  isCourse: boolean;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const SerieSchema = SchemaFactory.createForClass(Serie);
