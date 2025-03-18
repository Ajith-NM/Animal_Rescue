import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  _id: ObjectId;

  @Prop()
  userName: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  verify: boolean;

  @Prop()
  jti: string;

  @Prop()
  profile_image: string;

  @Prop()
  user_provider: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
