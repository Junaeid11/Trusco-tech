import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '@/modules/uploads/upload.controller';
import { requireAuth, requireAdmin } from '@/middleware/auth';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('application/') ||
        file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

/**
 * @swagger
 * /uploads/cloudinary:
 *   post:
 *     summary: Upload file to Cloudinary (Admin only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 */
router.post('/cloudinary', requireAuth, requireAdmin, upload.single('file'), UploadController.uploadToCloudinary);

/**
 * @swagger
 * /uploads/presign:
 *   post:
 *     summary: Get presigned URL for S3 upload (Admin only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - contentType
 *             properties:
 *               fileName:
 *                 type: string
 *               contentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 */
router.post('/presign', requireAuth, requireAdmin, UploadController.getS3PresignedUrl);

/**
 * @swagger
 * /uploads/cloudinary-policy:
 *   post:
 *     summary: Get Cloudinary upload policy (Admin only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folder:
 *                 type: string
 *                 default: ecommerce
 *     responses:
 *       200:
 *         description: Cloudinary upload policy generated successfully
 */
router.post('/cloudinary-policy', requireAuth, requireAdmin, UploadController.getCloudinaryUploadPolicy);

export default router;
