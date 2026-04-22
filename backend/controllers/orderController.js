const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @route POST /api/orders
// @desc Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    // Vérifier le stock et calculer le total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: product.price
      });

      // Réduire le stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Créer la commande
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      message: 'Commande créée',
      order
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route GET /api/orders
// @desc Récupérer les commandes de l'utilisateur
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Commandes récupérées',
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route GET /api/orders/:id
// @desc Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (order.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json({
      message: 'Commande récupérée',
      order
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route POST /api/orders/:id/payment
// @desc Payer une commande avec Stripe
exports.payOrder = async (req, res) => {
  try {
    const { token } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Cette commande a déjà été payée' });
    }

    // Créer un paiement Stripe
    const charge = await stripe.charges.create({
      amount: Math.round(order.totalPrice * 100), // en centimes
      currency: 'xof',
      source: token,
      description: `Commande Univers Scout #${order._id}`
    });

    // Mettre à jour la commande
    order.paymentStatus = 'completed';
    order.transactionId = charge.id;
    order.orderStatus = 'processing';
    await order.save();

    res.status(200).json({
      message: 'Paiement réussi',
      order
    });
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
    res.status(500).json({ message: 'Erreur lors du paiement', error: error.message });
  }
};