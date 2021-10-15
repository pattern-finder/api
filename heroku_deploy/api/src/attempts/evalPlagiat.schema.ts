import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type CodePlagiatDocument = CodePlagiat & Document;

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
