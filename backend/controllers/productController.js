const Product = require('../models/Product');
const Category = require('../models/Category');

// @route GET /api/products
// @desc Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let filter = {};

    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) filter.category = cat._id;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).populate('category');

    res.status(200).json({
      message: 'Produits récupérés',
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route GET /api/products/:id
// @desc Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json({
      message: 'Produit récupéré',
      product
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @route POST /api/products/:id/review
// @desc Ajouter une review à un produit
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si l'utilisateur a déjà commenté
    const existingReview = product.reviews.find(r => r.user.toString() === req.userId);
    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis sur ce produit' });
    }

    product.reviews.push({
      user: req.userId,
      rating,
      comment
    });

    // Recalculer la moyenne des notes
    const avgRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    product.rating = avgRating;

    await product.save();

    res.status(201).json({
      message: 'Avis ajouté avec succès',
      product
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};