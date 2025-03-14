import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleTokenVerifyDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
