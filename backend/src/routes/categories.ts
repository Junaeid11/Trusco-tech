import { Router } from 'express';
const router = Router();
// GET /api/v1/categories (flat)
router.get('/', (req, res) => {/* Controller */});
// GET /api/v1/categories/tree (mega menu)
router.get('/tree', (req, res) => {/* Controller */});
// POST /api/v1/categories (admin)
router.post('/', (req, res) => {/* Controller */});
// PATCH /api/v1/categories/:id (admin)
router.patch('/:id', (req, res) => {/* Controller */});
export default router;
