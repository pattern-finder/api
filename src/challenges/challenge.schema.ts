import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  completedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
