import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class Phase {
  name: string;
  script: string;
}

export type LanguageDocument = Language & Document;

@Schema()
export class Language {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  phases: Phase[];

  @Prop()
  editedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
