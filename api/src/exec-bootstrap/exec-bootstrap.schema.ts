import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ExecBootstrapDocument = ExecBootstrap & Document;

@Schema()
export class ExecBootstrap {
  _id?: string;

  @Prop({ type: Types.ObjectId, ref: 'Challenge', required: true })
  challenge: string;

  // Reference to unique property name on language
  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  tests: string;

  @Prop({ required: true })
  functionTemplate: string;

  @Prop()
  editedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ExecBootstrapSchema = SchemaFactory.createForClass(ExecBootstrap);
