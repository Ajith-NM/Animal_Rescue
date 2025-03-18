import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Users } from '../users/users.schema';
export type RepliesDocument = HydratedDocument<Replies>;

@Schema()
export class Replies {
  _id: ObjectId;

  @Prop()
  Replies_content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  Replies_writer: Users;

  @Prop({ default: Date.now() })
  Replies_date: Date;
}

export const RepliesSchema = SchemaFactory.createForClass(Replies);
