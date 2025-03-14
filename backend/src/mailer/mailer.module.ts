import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import * as sgMail from '@sendgrid/mail';
import { MAILER } from './mailerConstants';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  exports: [MailerService],
  providers: [
    {
      provide: MAILER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mailer = sgMail.setApiKey(configService.get('SENDGRID_API_KEY'));
        return mailer;
      },
    },
    MailerService,
  ],
})
export class MailerModule {}
