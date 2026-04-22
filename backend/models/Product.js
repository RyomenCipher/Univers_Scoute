const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez entrer le nom du produit'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez entrer la description du produit']
  },
  price: {
    type: Number,
    required: [true, 'Veuillez entrer le prix'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    required: [true, 'Veuillez entrer la quantité en stock'],
    min: [0, 'Le stock ne peut pas être négatif']
  },
  colors: [{
    name: String,
    hex: String
  }],
  sizes: [String],
  variants: [{
    color: String,
    size: String,
    stock: Number
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);