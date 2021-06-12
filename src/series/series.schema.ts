import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SerieDocument = Serie & Document;

@Schema()
export class Serie {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const SerieSchema = SchemaFactory.createForClass(Serie);
