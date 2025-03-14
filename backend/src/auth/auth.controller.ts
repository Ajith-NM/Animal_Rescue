import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/request/signupRequest.dto';
import { Response } from 'express';
import { LoginDto } from './dtos/request/loginRequest.dto';
import { VerifyDto } from './dtos/request/verifyRequest.dto';
import { ForgotDto } from './dtos/request/forgotRequest.dto';
import { ResetDto } from './dtos/request/resetRequest.dto';
import { ResendVerifyLinkDto } from './dtos/request/resendVerifyLinkRequest.dto';
import { GoogleTokenVerifyDto } from './dtos/request/googleRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async postSignup(@Body() body: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.postSignup(body);
      if (result.status) {
        return res.status(201).json(result);
      }
      return res.status(406).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'signup failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async postLogin(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.postLogin(
        body.email,
        body.password,
      );
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'login failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('verify')
  async verify(@Res() res: Response, @Body() body: VerifyDto) {
    try {
      const result = await this.authService.postVerify(body.token);
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'email verification failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('forgot')
  async forgotPassword(@Body() body: ForgotDto, @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(body.email);
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(406).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'something went wrong',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('reset')
  async resetPassword(@Body() body: ResetDto, @Res() res: Response) {
    try {
      const result = await this.authService.resetPassword(
        body.password,
        body.token,
      );
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(406).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'something went wrong',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('verify/resend')
  async resendVerifyLink(
    @Query() query: ResendVerifyLinkDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.resendVerifyLink(query.email);
      if (result.status) {
        res.status(200).json(result);
      }
      res.status(406).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'something went wrong',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('verify-google-token')
  async verifyGoogleToken(
    @Body() body: GoogleTokenVerifyDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.verifyGoogleToken(body.idToken);
      if (result.status) {
        return res.status(200).json(result);
      }
      return res.status(401).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: 'something went wrong',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
