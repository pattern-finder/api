import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Document, Types } from 'mongoose';
import { Challenge } from 'src/challenges/challenge.schema';
import { Language } from 'src/languages/language.schema';

export type AttemptDocument = Attempt & Document;

@Schema()
export class Attempt {
  _id?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: Challenge.name, required: true })
  challenge: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Language.name })
  language: string;

  @Prop()
  status: number;

  @Prop()
  stdout: string;

  @Prop()
  stderr: string;

  @Prop()
  time: number;

  @Prop()
  time_wall: number;

  @Prop()
  used_memory: number;

  @Prop()
  csw_voluntary: number;

  @Prop()
  csw_forced: number;

  @Prop()
  editedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
