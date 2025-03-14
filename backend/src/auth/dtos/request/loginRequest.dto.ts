import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signupRequest.dto';

export class LoginDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}
