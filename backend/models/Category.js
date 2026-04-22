const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez entrer le nom de la catégorie'],
    enum: ['Tissus réglementaires', 'Insignes', 'Foulards', 'Équipements'],
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);