import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  imageUrl: string;

  //challenges without any owners are the default challenges.
  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
