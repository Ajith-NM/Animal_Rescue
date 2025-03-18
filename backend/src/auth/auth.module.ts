import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users, UsersSchema } from 'src/schemas/users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
