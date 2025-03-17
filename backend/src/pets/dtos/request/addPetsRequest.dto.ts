import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class NewPetsDto {
  @ApiProperty()
  @IsString()
  pet_name: string;

  @ApiProperty()
  @IsString()
  pet_breed: string;

  @ApiProperty()
  @IsString()
  pet_age: string;

  @ApiProperty()
  @IsString()
  pet_specialneeds: string;

  @ApiProperty()
  @IsString()
  pet_vaccinated: string;

  @ApiProperty()
  @IsString()
  @IsIn(['Available', 'Adopted', 'Pending'])
  pet_adoption_status: 'Available' | 'Adopted' | 'Pending';

  @ApiProperty()
  @IsString()
  pet_gender: string;

  @ApiProperty()
  @IsString()
  pet_species: string;

  @ApiProperty()
  @IsString()
  pet_description: string;
}
