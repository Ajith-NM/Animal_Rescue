import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Users } from '../users/users.schema';
import { Comments } from './comments.schema';
export type BlogsDocument = HydratedDocument<Blogs>;

@Schema()
export class Blogs {
  _id: ObjectId;

  @Prop()
  blog_title: string;

  @Prop()
  blog_image: string;

  @Prop()
  blog_content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  blog_writer: Users;

  @Prop({ default: Date.now() })
  blog_date: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] })
  blog_liked_Users: Users[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }] })
  blog_comments: Comments[];

  @Prop()
  blog_category: string;
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);
