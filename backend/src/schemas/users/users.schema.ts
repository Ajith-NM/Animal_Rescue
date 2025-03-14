import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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

export const UserSchema = SchemaFactory.createForClass(User);
