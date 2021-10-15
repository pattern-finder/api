import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Document, Types } from 'mongoose';
import { ExecBootstrap } from 'src/exec-bootstrap/exec-bootstrap.schema';

export type AttemptDocument = CodePlagiat & Document;

@Schema()
export class CodePlagiat {
  _id?: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  exercice: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const CodePlagiatSchema = SchemaFactory.createForClass(CodePlagiat);
