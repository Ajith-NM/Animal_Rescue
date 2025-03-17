import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Pets, PetsSchema } from 'src/schemas/pets/pets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pets.name, schema: PetsSchema }]),
    UploadModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
