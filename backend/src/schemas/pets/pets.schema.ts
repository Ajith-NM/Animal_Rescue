import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type PetsDocument = HydratedDocument<Pets>;

@Schema()
export class Pets {
  _id: ObjectId;

  @Prop()
  pet_name: string;

  @Prop()
  pet_breed: string;

  @Prop()
  pet_age: string;

  @Prop()
  pet_picture: string;

  @Prop()
  pet_specialneeds: string;

  @Prop()
  pet_vaccinated: string;

  @Prop()
  pet_adoption_status: string;

  @Prop()
  pet_gender: string;

  @Prop()
  pet_species: string;

  @Prop()
  pet_description: string;
}

export const PetsSchema = SchemaFactory.createForClass(Pets);
