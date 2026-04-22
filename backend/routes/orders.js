const express = require('express');
const { createOrder, getMyOrders, getOrderById, payOrder } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes de commandes sont protégées
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/payment', payOrder);

module.exports = router;