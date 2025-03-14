import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'userName required' })
  @IsString()
  userName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password required' })
  @IsString()
  @MinLength(6, { message: 'minimum 6 digits required' })
  password: string;
}
