import { Router } from 'express';
const router = Router();
// GET /api/v1/wishlist (auth)
router.get('/', (req, res) => {/* Controller */});
// POST /api/v1/wishlist/:productId (auth)
router.post('/:productId', (req, res) => {/* Controller */});
// DELETE /api/v1/wishlist/:productId (auth)
router.delete('/:productId', (req, res) => {/* Controller */});
export default router;
