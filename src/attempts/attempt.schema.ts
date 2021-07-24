import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Document, Types } from 'mongoose';
import { ExecBootstrap } from 'src/exec-bootstrap/exec-bootstrap.schema';

export type AttemptDocument = Attempt & Document;

@Schema()
export class Attempt {
  _id?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: ExecBootstrap.name, required: true })
  execBootstrap: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  phase: string;

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
