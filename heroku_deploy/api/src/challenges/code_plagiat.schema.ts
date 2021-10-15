import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema()
export class EvalPlagiat {
  _id?: string;

  @Prop({ required: true, unique: true })
  toke: string;

  @Prop({ required: true })
  exercice: string;

  @Prop({ required: true })
  langage: string;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const EvalPlagiatCst = SchemaFactory.createForClass(EvalPlagiat);
