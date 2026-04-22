const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getStats
} = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes admin sont protégées et nécessitent le rôle admin
router.use(authenticate, isAdmin);

// Gestion des produits
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Gestion des commandes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Statistiques
router.get('/stats', getStats);

module.exports = router;