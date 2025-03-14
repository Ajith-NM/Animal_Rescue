import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  _id: ObjectId;

  @Prop()
  userName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
