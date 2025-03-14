import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users/users.schema';
import { SignupDto } from './dtos/request/signupRequest.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { User_providerType } from './types/userProviderTypes';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  //generate jwt token
  async generateToken(user: any, time: string = '1d') {
    const token = await this.jwtService.signAsync(user, { expiresIn: time });
    return token;
  }
  // decode jwt token And verify
  async decodeToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('SECRET_KEY'),
    });
    return payload;
  }

  // decode jwt token
  async jwtDecode(token: string) {
    const payload = await this.jwtService.decode(token, { complete: true });
    return payload;
  }

  //create new user
  async createNewUser(
    userName: string,
    email: string,
    hashedPassword: string,
    jti: string,
    profileImage: string,
    provider: User_providerType,
    verify: boolean,
  ) {
    const createdUser = new this.userModel({
      userName: userName,
      email: email,
      password: hashedPassword,
      profile_image: profileImage,
      user_provider: provider,
      jti: jti,
      verify: verify,
    });
    return await createdUser.save();
  }

  async postSignup(body: SignupDto) {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(body.password, saltOrRounds);
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username: body.userName }, { email: body.email }],
      })
      .lean<UserDocument>();
    const uid = Date.now().toString();
    const sendVerificationMail = async () => {
      const token = await this.generateToken(
        {
          email: body.email,
          jti: uid,
        },
        '900s',
      );
      console.log('mailed token=', token);

      await this.mailerService.sendEmailVerification(
        body.email,
        "Let's verify your email for signup",
        `Dear ${body.userName}`,
        'signup',
        token,
        body.userName,
      );
    };
    if (!existingUser) {
      await sendVerificationMail();
      const newUser = await this.createNewUser(
        body.userName,
        body.email,
        hashPassword,
        uid,
        'image',
        'internal',
        false,
      );
      return {
        status: true,
        message: 'user created',
        data: newUser,
      };
    }
    if (!existingUser?.verify) {
      const newUser = await this.userModel.findByIdAndUpdate(
        existingUser._id,
        {
          userName: body.userName,
          password: hashPassword,
          profile_image: 'image',
          jti: uid,
        },
        { new: true },
      );
      await sendVerificationMail();
      return { status: true, message: 'user created', data: newUser };
    }

    if (existingUser?.userName == body.userName) {
      return { status: false, message: 'username already taken' };
    }
    return { status: false, message: 'email already exists' };
  }

  async postLogin(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user && user.verify) {
      const isValidPassword = await bcrypt.compare(password, user?.password);
      if (isValidPassword) {
        const token = await this.generateToken({
          user_id: user._id,
        });
        return {
          status: true,
          message: 'login successfully',
          data: user,
          token: token,
        };
      }
      return {
        status: false,
        message: 'invalid password',
      };
    }
    return {
      status: false,
      message: 'specified user was not found',
    };
  }

  async postVerify(token: string) {
    function newError(message: string) {
      return {
        status: false,
        message: message,
      };
    }

    const payLoad = await this.decodeToken(token)
      .then((response) => response)
      .catch(() => {
        return newError('verification TimeOut,please try again');
      });
    if (payLoad?.email && payLoad?.jti) {
      const updated = await this.userModel.findOneAndUpdate(
        {
          email: payLoad.email,
          jti: payLoad.jti,
        },
        { verify: true },
        { new: true },
      );
      if (updated) {
        const token = await this.generateToken({
          user_id: updated._id,
        });

        return {
          status: true,
          message: 'verified',
          data: updated,
          token: token,
        };
      }
    }
    return newError('verification failed,please try again');
  }

  async forgotPassword(email: string) {
    const existingUser = await this.userModel.findOne({ email: email });
    const uid = Date.now().toString();
    if (existingUser && existingUser.verify) {
      const token = await this.generateToken(
        {
          email: email,
          jti: uid,
        },
        '300s',
      );
      this.userModel.findByIdAndUpdate(existingUser._id, { jti: uid });
      await this.mailerService.sendEmailVerification(
        email,
        "Let's verify your email for Reseting password",
        `Dear ${existingUser.userName}`,
        'resetPassword',
        token,
        existingUser.userName,
      );
      return { status: true, message: 'verification mail sent' };
    }
    return {
      status: false,
      message: 'specified user was not found',
    };
  }
  async resetPassword(password: string, token: string) {
    const saltOrRounds = 10;
    function newError(message: string) {
      return { status: false, message: message };
    }
    const payLoad = await this.decodeToken(token)
      .then((response) => response)
      .catch(() => {
        return newError('Time limit exceeded. Please try again.');
      });
    if (payLoad?.email && payLoad?.jti) {
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      this.userModel.findOneAndUpdate(
        { email: payLoad.email, jti: payLoad.jti },
        { password: hashedPassword },
      );

      return {
        status: true,
        message: 'reset success',
      };
    }
    return newError('reset password failed,please try again');
  }

  async resendVerifyLink(email: string) {
    const uid = Date.now().toString();
    const existingUser = await this.userModel.findOne({ email: email });
    if (!existingUser) {
      return { status: false, message: 'specified user was not found' };
    }
    if (existingUser && !existingUser.verify) {
      const token = await this.generateToken(
        {
          email: email,
          jti: uid,
        },
        '900s',
      );
      await this.userModel.findOneAndUpdate({ email: email }, { jti: uid });
      await this.mailerService.sendEmailVerification(
        email,
        'Please verify your email',
        `Dear ${existingUser.userName}`,
        'signup',
        token,
        existingUser.userName,
      );
      return { status: true, message: 'verification mail sent' };
    }

    return { status: false, message: 'user already verified' };
  }

  async verifyGoogleToken(idToken: string) {
    const g_token = this.configService.get('GOOGLE_CLIENT_ID');
    const client = new OAuth2Client();
    let result: null | TokenPayload = null;
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: g_token,
      });
      console.log(ticket);

      const payload = ticket.getPayload();
      if (payload.email_verified) {
        result = payload;
      }
    }
    await verify().catch(() => {
      result = null;
    });
    console.log(result);

    if (result) {
      const existingUser = await this.userModel.findOne({
        email: result.email,
        user_provider: 'google',
      });
      if (!existingUser) {
        const saltOrRounds = 10;
        const hashPassword = await bcrypt.hash(result.sub, saltOrRounds);
        const newUser = await this.createNewUser(
          result.name,
          result.email,
          hashPassword,
          null,
          result.picture,
          'google',
          true,
        );
        const jwtToken = await this.generateToken({
          user_id: newUser._id,
        });
        return {
          status: true,
          message: 'user verified',
          data: newUser,
          token: jwtToken,
        };
      }
      const jwtToken = await this.generateToken({
        user_id: existingUser._id,
      });
      return {
        status: true,
        message: 'user verified',
        data: existingUser,
        token: jwtToken,
      };
    }
    return { status: false, message: 'user verification failed' };
  }
}
