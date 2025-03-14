import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  token: string;
}
