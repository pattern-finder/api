import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EvalPlagiatDocument = EvalPlagiat & Document;

@Schema()
export class EvalPlagiat {
  @Prop()
  tokenCode: string;

  @Prop()
  nameExo: string;

  @Prop()
  userId: string;
}

export const EvalPlagiatSchema = SchemaFactory.createForClass(EvalPlagiat);
