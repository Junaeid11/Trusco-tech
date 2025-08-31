import { Router } from 'express';
const router = Router();
// GET /api/v1/products/:id/reviews
router.get('/products/:id/reviews', (req, res) => {/* Controller */});
// POST /api/v1/products/:id/reviews (auth)
router.post('/products/:id/reviews', (req, res) => {/* Controller */});
// PATCH /api/v1/reviews/:id (admin/moderation)
router.patch('/reviews/:id', (req, res) => {/* Controller */});
export default router;
