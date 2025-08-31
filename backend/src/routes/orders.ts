import { Router } from 'express';
import { OrderController } from './../modules/orders/order.controller';
import { requireAuth, requireAdmin } from './../middleware/auth';

const router = Router();

/**
 * @swagger
 * /orders/guest-cod:
 *   post:
 *     summary: Create guest COD order (no authentication required)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - address
 *               - items
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               phone:
 *                 type: string
 *                 minLength: 10
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: object
 *                 required:
 *                   - name
 *                   - phone
 *                   - address
 *                   - city
 *                   - state
 *                   - postalCode
 *                   - country
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [home, office, other]
 *                     default: home
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *                   isDefault:
 *                     type: boolean
 *                     default: false
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - qty
 *                     - price
 *                     - name
 *                     - thumbnail
 *                   properties:
 *                     productId:
 *                       type: string
 *                     qty:
 *                       type: number
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                     name:
 *                       type: string
 *                     thumbnail:
 *                       type: string
 *                       format: uri
 *                     variant:
 *                       type: string
 *               couponCode:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                     orderNumber:
 *                       type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/guest-cod', OrderController.createGuestCODOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create user order (authenticated)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *               - paymentProvider
 *             properties:
 *               addressId:
 *                 type: string
 *               paymentProvider:
 *                 type: string
 *                 enum: [stripe, sslcommerz, cod]
 *               couponCode:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', requireAuth, OrderController.createUserOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user orders (authenticated)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Orders retrieved successfully
 */
router.get('/', requireAuth, OrderController.getUserOrders);

/**
 * @swagger
 * /orders/guest:
 *   get:
 *     summary: Get guest orders by email and phone
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/guest', OrderController.getGuestOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID (owner or admin)
 *     tags: [Orders]
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
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/:id', requireAuth, OrderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
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
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch('/:id/status', requireAuth, requireAdmin, OrderController.updateOrderStatus);

export default router;
