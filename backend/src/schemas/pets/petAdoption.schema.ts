import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type PetsAdoptionDocument = HydratedDocument<PetsAdoption>;

@Schema()
export class PetsAdoption {
  _id: ObjectId;

  @Prop()
  PetsAdoption_petID: string;

  @Prop()
  PetsAdoption_userID: string;

  @Prop()
  PetsAdoption_date: string;
}

export const PetsAdoptionSchema = SchemaFactory.createForClass(PetsAdoption);
