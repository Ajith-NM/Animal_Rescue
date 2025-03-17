import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/cloudinaryResponseType';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    status: boolean;
    data: any;
  }> {
    try {
      if (!file.mimetype.startsWith('image/')) {
        return {
          status: false,
          data: 'Only image files are allowed!',
        };
      }

      const upload = new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
      const uploadResponse = await upload;
      console.log('res=', uploadResponse);

      return {
        status: true,
        data: uploadResponse,
      };
    } catch (error) {
      console.log(error);

      return {
        status: false,
        data: error.message,
      };
    }
  }
}
