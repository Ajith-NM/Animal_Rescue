import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerifyLinkDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
