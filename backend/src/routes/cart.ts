import { Router } from 'express';
const router = Router();
// GET /api/v1/cart (auth)
router.get('/', (req, res) => {/* Controller */});
// POST /api/v1/cart/items (auth)
router.post('/items', (req, res) => {/* Controller */});
// DELETE /api/v1/cart/items/:productId (auth)
router.delete('/items/:productId', (req, res) => {/* Controller */});
export default router;
