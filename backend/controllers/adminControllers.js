const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');

// ===== GESTION DES PRODUITS =====

// @route POST /api/admin/products
// @desc Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, colors, sizes, image } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
    }

    const cat = await Category.findOne({ name: category });
    if (!cat) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: cat._id,
      stock,
      colors: colors || [],
      sizes: sizes || [],
      image
    });

    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route PUT /api/admin/products/:id
// @desc Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, colors, sizes, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, colors, sizes, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json({
      message: 'Produit mis à jour avec succès',
      product
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route DELETE /api/admin/products/:id
// @desc Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json({
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ===== GESTION DES COMMANDES =====

// @route GET /api/admin/orders
// @desc Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Toutes les commandes',
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route PUT /api/admin/orders/:id/status
// @desc Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('items.product').populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({
      message: 'Statut de la commande mis à jour',
      order
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ===== STATISTIQUES =====

// @route GET /api/admin/stats
// @desc Récupérer les statistiques du site
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate('items.product', 'name');

    res.status(200).json({
      message: 'Statistiques du site',
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};