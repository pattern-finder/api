import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Document, Types } from 'mongoose';
import { Challenge } from 'src/challenges/challenge.schema';

export enum Language {
  CPP = 'c++',
  RUST = 'rust',
  PYTHON = 'python',
  BASH = 'bash',
}

export type AttemptDocument = Attempt & Document;

@Schema()
export class Attempt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Challenge', required: true })
  challenge: Challenge;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: String, enum: Object.values(Language) })
  language: Language;

  @Prop({ required: true })
  token: string;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
