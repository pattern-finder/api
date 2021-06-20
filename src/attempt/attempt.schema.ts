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
  _id?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Challenge', required: true })
  challenge: Challenge;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: String, enum: Object.values(Language) })
  language: Language;

  @Prop({ required: true })
  status: number;

  @Prop({ required: true })
  stdout: string;

  @Prop({ required: true })
  stderr: string;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  time_wall: number;

  @Prop({ required: true })
  used_memory: number;

  @Prop({ required: true })
  csw_voluntary: number;

  @Prop({ required: true })
  csw_forced: number;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
