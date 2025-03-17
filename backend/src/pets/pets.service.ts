import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pets } from 'src/schemas/pets/pets.schema';
import { NewPetsDto } from './dtos/request/addPetsRequest.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pets.name) private petsModel: Model<Pets>,
    private readonly uploadService: UploadService,
  ) {}
  async postAddNewPets(file: Express.Multer.File, body: NewPetsDto) {
    const uploadResponse = await this.uploadService.uploadFile(file);

    if (uploadResponse.status && uploadResponse.data.secure_url) {
      const newPet = new this.petsModel({
        pet_name: body.pet_name,
        pet_age: body.pet_age,
        pet_breed: body.pet_breed,
        pet_description: body.pet_description,
        pet_picture: uploadResponse.data.secure_url,
        pet_adoption_status: body.pet_adoption_status,
        pet_gender: body.pet_gender,
        pet_species: body.pet_species,
        pet_vaccinated: body.pet_vaccinated,
        pet_specialneeds: body.pet_specialneeds,
      });

      const newlyAddedPet = await newPet.save();
      return {
        status: true,
        message: 'new pet added',
        data: newlyAddedPet,
      };
    }
    return {
      status: uploadResponse.status,
      message: 'file Upload failed',
      data: uploadResponse.data,
    };
  }
}
