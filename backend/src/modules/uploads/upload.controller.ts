import { Request, Response } from 'express';
import { UploadService } from './upload.service';
import { ApiResponse } from '@/types';

export class UploadController {
  static async uploadToCloudinary(req: Request, res: Response<ApiResponse>) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const result = await UploadService.uploadToCloudinary(req.file);

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getS3PresignedUrl(req: Request, res: Response<ApiResponse>) {
    try {
      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({
          success: false,
          message: 'fileName and contentType are required',
        });
      }

      const presignedData = await UploadService.getS3PresignedUrl(fileName, contentType);

      res.json({
        success: true,
        message: 'Presigned URL generated successfully',
        data: presignedData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate presigned URL',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getCloudinaryUploadPolicy(req: Request, res: Response<ApiResponse>) {
    try {
      const { folder } = req.body;
      const presignedData = await UploadService.getCloudinaryUploadPolicy(folder);

      res.json({
        success: true,
        message: 'Cloudinary upload policy generated successfully',
        data: presignedData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate Cloudinary upload policy',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
