import { Router } from 'express';
import multer from 'multer';
import { ProductController } from '../modules/products/product.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for product name and SKU
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *       - in: query
 *         name: price[min]
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: price[max]
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: rating[min]
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter products in stock
 *       - in: query
 *         name: attributes
 *         schema:
 *           type: string
 *         description: JSON string of attribute filters
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, rating, -rating]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                 facets:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                     brands:
 *                       type: array
 *                     priceRange:
 *                       type: object
 *                     ratingRange:
 *                       type: object
 */
router.get('/', ProductController.getProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/slug/:slug', ProductController.getProductBySlug);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', ProductController.getProductById);

/**
 * @swagger
 * /products/{id}/related:
 *   get:
 *     summary: Get related products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Related products retrieved successfully
 */
router.get('/:id/related', ProductController.getRelatedProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product with image uploads (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - brand
 *               - categories
 *               - price
 *               - stock
 *               - shortDescription
 *               - descriptionHtml
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               sku:
 *                 type: string
 *               brand:
 *                 type: string
 *               categories:
 *                 type: string
 *                 description: JSON array of category IDs
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Product thumbnail image
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional product images
 *               price:
 *                 type: number
 *                 minimum: 0
 *               currency:
 *                 type: string
 *                 enum: [BDT, USD]
 *                 default: USD
 *               discount:
 *                 type: string
 *                 description: JSON object for discount
 *               stock:
 *                 type: number
 *                 minimum: 0
 *               attributes:
 *                 type: string
 *                 description: JSON object for attributes
 *               shortDescription:
 *                 type: string
 *               descriptionHtml:
 *                 type: string
 *               warranty:
 *                 type: string
 *               emi:
 *                 type: string
 *                 description: JSON object for EMI settings
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAuth, requireAdmin, upload.array('images', 9), ProductController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', requireAuth, requireAdmin, ProductController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', requireAuth, requireAdmin, ProductController.deleteProduct);

export default router;
