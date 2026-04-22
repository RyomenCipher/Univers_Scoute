const express = require('express');
const { getAllProducts, getProductById, addReview } = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Routes protégées
router.post('/:id/review', authenticate, addReview);

module.exports = router;