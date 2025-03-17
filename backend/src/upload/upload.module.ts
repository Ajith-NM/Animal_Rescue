import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  controllers: [],
  exports: [UploadService],
  providers: [
    {
      provide: 'cloudinary',
      useFactory: async () => {
        const cloudinaryUpload = cloudinary;
        cloudinaryUpload.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_SECRET_KEY,
        });
        return cloudinaryUpload;
      },
    },
    UploadService,
  ],
})
export class UploadModule {}
