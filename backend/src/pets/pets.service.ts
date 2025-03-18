import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pets } from 'src/schemas/pets/pets.schema';
import { NewPetsDto } from './dtos/request/addPetsRequest.dto';
import { UploadService } from 'src/upload/upload.service';
import { PetsStatusDto } from './dtos/request/updatePetRequest';

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
  async putUpdatePetsStatus(body: PetsStatusDto) {
    try {
      const pet = await this.petsModel.findByIdAndUpdate(
        body.pet_id,
        {
          pet_adoption_status: body.pet_status,
        },
        { new: true },
      );
      return {
        status: true,
        message: 'pet updation completed',
        data: pet,
      };
    } catch (error) {
      return {
        status: false,
        data: error,
        message: 'pets update status failed',
      };
    }
  }

  async deletePet(id: string) {
    try {
      const pet = await this.petsModel.findByIdAndDelete(id);
      return {
        status: true,
        message: 'deletion completed',
        data: pet,
      };
    } catch (error) {
      return {
        status: false,
        data: error,
        message: 'pets update status failed',
      };
    }
  }

  async getAllPets() {
    try {
      const pets = await this.petsModel.find();
      if (pets) {
        return {
          status: true,
          message: 'fetch all pets',
          data: pets,
        };
      }
      return {
        status: true,
        message: 'no pets ',
      };
    } catch (error) {
      return {
        status: false,
        data: error,
        message: 'fetch all pets failed',
      };
    }
  }
}
