import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class PetDeleteDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  pet_id: string;
}
