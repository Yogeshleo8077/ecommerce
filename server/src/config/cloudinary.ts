import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { logger } from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud_name',
  api_key: env.CLOUDINARY_API_KEY || 'dummy_api_key',
  api_secret: env.CLOUDINARY_API_SECRET || 'dummy_api_secret',
});

// Helper to upload image buffers to Cloudinary
export const uploadImageToCloudinary = (fileBuffer: Buffer, folder: string = 'ecommerce'): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If keys are not set, return a mock URL
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      logger.warn('Cloudinary credentials not set. Returning a dummy image URL.');
      return resolve('https://via.placeholder.com/500');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          logger.error({ err: error }, 'Cloudinary upload error');
          return reject(error);
        }
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Unknown Cloudinary Error'));
        }
      }
    );

    // End the stream by passing the buffer
    uploadStream.end(fileBuffer);
  });
};
