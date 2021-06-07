import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type PictureDocument = Picture & Document;

@Schema()
export class Picture {
  @Prop({ required: true, unique: true })
  filename: string;

  //challenges without any owners are the default challenges.
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ require: true })
  alt: string;

  @Prop()
  editedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}
