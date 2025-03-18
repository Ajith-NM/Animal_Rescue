import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Users } from '../users/users.schema';
import { Replies } from './reply.schema';
export type CommentsDocument = HydratedDocument<Comments>;

@Schema()
export class Comments {
  _id: ObjectId;

  @Prop()
  comment_content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  comment_writer: Users;

  @Prop({ default: Date.now() })
  comment_date: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Replies' }] })
  comment_replies: Replies[];
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
