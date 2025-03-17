import * as cloudinary from 'cloudinary';
const name = process.env.CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_SECRET_KEY;

cloudinary.v2.config({
  cloud_name: name,
  api_key: key,
  api_secret: secret,
});

export default cloudinary.v2;
