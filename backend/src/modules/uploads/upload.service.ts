import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './../../config';
// If BadRequestError is the default export:
import {BadRequestError} from './../../utils/errors';

// Or, if the correct named export is 'badRequestError':
// import { badRequestError } from './../../utils/errors';

export interface UploadResult {
  url: string;
  publicId?: string;
  key?: string;
}

export interface PresignedData {
  url: string;
  fields: Record<string, string>;
  key: string;
}

export class UploadService {
  private static s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId!,
      secretAccessKey: config.aws.secretAccessKey!,
    },
  });

  static async uploadToCloudinary(file: Express.Multer.File): Promise<UploadResult> {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      throw new BadRequestError('Cloudinary configuration is missing');
    }

    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new BadRequestError('Failed to upload to Cloudinary'));
          } else {
            resolve({
              url: result!.secure_url,
              publicId: result!.public_id,
            });
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  static async getS3PresignedUrl(fileName: string, contentType: string): Promise<PresignedData> {
    if (!config.aws.s3Bucket) {
      throw new BadRequestError('S3 configuration is missing');
    }

    const key = `ecommerce/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return {
      url,
      fields: {},
      key,
    };
  }

  static async getCloudinaryUploadPolicy(folder: string = 'ecommerce'): Promise<PresignedData> {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      throw new BadRequestError('Cloudinary configuration is missing');
    }

    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(params, config.cloudinary.apiSecret);

    return {
      url: `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/auto/upload`,
      fields: {
        api_key: config.cloudinary.apiKey,
        timestamp,
        signature,
        folder,
      },
      key: `${folder}/${timestamp}`,
    };
  }
}
