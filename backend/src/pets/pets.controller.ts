import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { NewPetsDto } from './dtos/request/addPetsRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { PetsStatusDto } from './dtos/request/updatePetRequest';
import { PetDeleteDto } from './dtos/request/deletePetRequest.dto';
@Controller('pets')
export class PetsController {
  constructor(private petService: PetsService) {}

  @Post('add-pets')
  @UseInterceptors(FileInterceptor('file'))
  async addNewPets(
    @Body() body: NewPetsDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.petService.postAddNewPets(file, body);
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update-pet-status')
  async updatePetsStatus(@Body() body: PetsStatusDto, @Res() res: Response) {
    try {
      const result = await this.petService.putUpdatePetsStatus(body);
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('delete-pet')
  async deletePet(@Param() param: PetDeleteDto, @Res() res: Response) {
    try {
      const result = await this.petService.deletePet(param.pet_id);
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
