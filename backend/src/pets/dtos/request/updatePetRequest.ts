import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class PetsStatusDto {
  @ApiProperty()
  @IsString()
  pet_status: string;

  @IsString()
  @IsMongoId()
  pet_id: string;
}
